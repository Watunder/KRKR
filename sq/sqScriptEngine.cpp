#include <stdio.h>
#include <tchar.h>
#include <vector>

#include <squirrel.h>
#include <sqstdio.h>
#include <sqstdblob.h>
#include <sqstdaux.h>
#include <sqthread.h>
#include <sqcont.h>

#include "krkr.h"

#include "sqTJSObject.h"

// global space name
#define KIRIKIRI_GLOBAL L"tjs"
#define SQUIRREL_GLOBAL L"sq"

// sq vm
static HSQUIRRELVM vm = NULL;

//
// sq register
//

extern void sq_pushvariant(HSQUIRRELVM v, tTJSVariant &variant);
extern SQRESULT sq_getvariant(HSQUIRRELVM v, int idx, tTJSVariant *result);
extern SQRESULT sq_getvariant(sqobject::ObjectInfo &obj, tTJSVariant *result);
extern void SQEXCEPTION(HSQUIRRELVM v);

// sq register global to tjs

static void registerglobal(HSQUIRRELVM v, const SQChar *name, tTJSVariant &variant)
{
	sq_pushroottable(v);
	sq_pushstring(v, name, -1);
	sq_pushvariant(v, variant);
	sq_createslot(v, -3); 
	sq_pop(v, 1);
}

// sq unregister global from tjs

static void unregisterglobal(HSQUIRRELVM v, const SQChar *name)
{
	sq_pushroottable(v);
	sq_pushstring(v, name, -1);
	sq_deleteslot(v, -2, SQFalse); 
	sq_pop(v, 1);
}

//
// NI_sqScriptEngine
//

class NI_sqScriptEngine
{
public:
	NI_sqScriptEngine(){};

	/**
	 * squirrel スクリプトの読み込み
	 * @param script スクリプト
	 * @throw コンパイルに失敗
	 * @return 読み込まれたスクリプト
	 */
	static tjs_error TJS_INTF_METHOD load(tTJSVariant *result,
										  tjs_int numparams,
										  tTJSVariant **param,
										  iTJSDispatch2 *objthis)
	{
		if (numparams <= 0) return TJS_E_BADPARAMCOUNT;
		if (SQ_SUCCEEDED(sq_compilebuffer(vm, param[0]->GetString(), param[0]->AsString()->GetLength(), L"TEXT", SQTrue))) {
			sq_getvariant(vm, -1, result);
			sq_pop(vm, 1);
		} else {
			SQEXCEPTION(vm);
		}
		return TJS_S_OK;
	}

	/**
	 * squirrel スクリプトの実行
	 * @param script スクリプト
	 * @param ... 引数
	 * @throw コンパイルに失敗
	 * @throw 実行に失敗
	 * @return 実行結果
	 */
	static tjs_error TJS_INTF_METHOD exec(tTJSVariant *result,
										  tjs_int numparams,
										  tTJSVariant **param,
										  iTJSDispatch2 *objthis)
	{
		if (numparams <= 0) return TJS_E_BADPARAMCOUNT;
		if (SQ_SUCCEEDED(sq_compilebuffer(vm, param[0]->GetString(), param[0]->AsString()->GetLength(), L"TEXT", SQTrue))) {
			sq_pushroottable(vm); // this
			for (int i=1;i<numparams;i++) {	// 引数
				sq_pushvariant(vm, *param[i]);
			}
			if (SQ_SUCCEEDED(sq_call(vm, numparams, result ? SQTrue:SQFalse, SQTrue))) {
				if (result) {
					sq_getvariant(vm, -1, result);
					sq_pop(vm, 1);
				}
				sq_pop(vm, 1);
			} else {
				sq_pop(vm, 1);
				SQEXCEPTION(vm);
			}
		} else {
			SQEXCEPTION(vm);
		}
		return TJS_S_OK;
	}

	/**
	 * Squirrel スクリプトのスレッド実行。
	 * @param text スクリプトが格納された文字列
	 * @param ... 引数
	 * @throw コンパイルに失敗
	 * @throw スレッド生成に失敗
	 * @return Threadオブジェクト
	 */
	static tjs_error TJS_INTF_METHOD fork(tTJSVariant *result,
										  tjs_int numparams,
										  tTJSVariant **param,
										  iTJSDispatch2 *objthis)
	{
		if (numparams <= 0) return TJS_E_BADPARAMCOUNT;
		sq_pushroottable(vm);
		sq_pushstring(vm, SQTHREADNAME, -1);
		if (SQ_SUCCEEDED(sq_get(vm,-2)))
		{
			sq_pushroottable(vm);
			sq_pushnull(vm);
			if (SQ_SUCCEEDED(sq_compilebuffer(vm, param[0]->GetString(), param[0]->AsString()->GetLength(), L"TEXT", SQTrue)))
			{
				for (int i=1;i<numparams;i++)
				{
					sq_pushvariant(vm, *param[i]);
				}
				if (SQ_SUCCEEDED(sq_call(vm, numparams+2, SQTrue, SQTrue)))
				{
					sq_getvariant(vm, -1, result);
					sq_pop(vm, 3);
				}
				else
				{
					sq_pop(vm, 2);
					SQEXCEPTION(vm);
				}
			}
			else
			{
				sq_pop(vm, 4);
				SQEXCEPTION(vm);
			}
		}
		else
		{
			sq_pop(vm,1);
			SQEXCEPTION(vm);
		}
		return TJS_S_OK;
	}

	/**
	 * スレッド終了コールバックを呼び出す
	 */
	static void onThreadDone(sqobject::ObjectInfo th, void *userData)
	{
		tTJSVariant *method = (tTJSVariant*)userData;
		th.push(vm);

		class FuncInfo
		{	
		public:
			/**
			 * コンストラクタ
			 * @param method 呼び出し対象メソッド
			 * @param HSQUIRRELVM v 引数参照用VM
			 * @param argc PUSHしてある引数の数
			 */
			FuncInfo(tTJSVariant &method, HSQUIRRELVM v, int argc) : method(method), argc(argc), args(NULL)
			{
				// 引数生成
				if (argc > 0)
				{
					args = new tTJSVariant*[(size_t)argc];
					for (tjs_int i=0;i<argc;i++)
					{
						args[i] = new tTJSVariant();
						sq_getvariant(v, i-argc, args[i]);
					}
					sq_pop(v, argc);
				}
			}
			
			// デストラクタ
			~FuncInfo()
			{
				// 引数破棄
				if (args)
				{
					for (int i=0;i<argc;i++)
					{
						delete args[i];
					}
					delete[] args;
				}
			}
			
			void exec()
			{
				TVPDoTryBlock(TryExec, Catch, Finally, (void *)this);
			}
			
		private:
			
			void _TryExec()
			{
				tjs_error error;
				if (TJS_SUCCEEDED(error = method.AsObjectClosureNoAddRef().FuncCall(0, NULL, NULL, NULL, argc, args, NULL)))
				{
				}
			}
			
			static void TJS_USERENTRY TryExec(void * data)
			{
				FuncInfo *info = (FuncInfo*)data;
				info->_TryExec();
			}
			
			static bool TJS_USERENTRY Catch(void * data, const tTVPExceptionDesc & desc)
			{
				FuncInfo *info = (FuncInfo*)data;
				TVPAddLog(desc.message.c_str());
				return false;
			}
			
			static void TJS_USERENTRY Finally(void * data)
			{
			}

		private:
			tjs_int argc;
			tTJSVariant **args;
			tTJSVariant method;
		} func(*method, vm, 1);
		func.exec();
	}
	
	/**
	 * squirrelスレッドの実行
	 */
	static tjs_error TJS_INTF_METHOD drive(tTJSVariant *result,
										   tjs_int numparams,
										   tTJSVariant **param,
										   iTJSDispatch2 *objthis)
	{
		if (numparams < 1) return TJS_E_BADPARAMCOUNT;
		sqobject::Thread::update((int)*param[0]);
		sqobject::beforeContinuous();
		int count;
		if (numparams > 1) {
			count = sqobject::Thread::main(onThreadDone, param[1]);
		} else {
			count = sqobject::Thread::main();
		}
		sqobject::afterContinuous();
		if (result) {
			*result = count;
		}
		return TJS_S_OK;
	}

	/**
	 * トリガ実行
	 * @param name トリガ名
	 */
	static tjs_error TJS_INTF_METHOD trigger(tTJSVariant *result,
											 tjs_int numparams,
											 tTJSVariant **param,
											 iTJSDispatch2 *objthis)
	{
		if (numparams < 1) return TJS_E_BADPARAMCOUNT;
		sqobject::Thread::trigger(param[0]->GetString());
		return TJS_S_OK;
	}
	
	/**
	 * squirrel グローバルメソッドの呼び出し
	 * @param name メソッド名
	 * @param ... 引数
	 * @throw メソッドの取得に失敗
	 * @throw メソッドの呼び出しに失敗
	 * @return 実行結果
	 */
	static tjs_error TJS_INTF_METHOD call(tTJSVariant *result,
										  tjs_int numparams,
										  tTJSVariant **param,
										  iTJSDispatch2 *objthis)
	{
		if (numparams <= 0) return TJS_E_BADPARAMCOUNT;
		sq_pushroottable(vm);
		sq_pushstring(vm, param[0]->GetString(), -1);
		if (SQ_SUCCEEDED(sq_get(vm, -2))) { // ルートテーブルから関数を取得
			sq_pushroottable(vm); // this
			for (int i=1;i<numparams;i++) {	// 引数
				sq_pushvariant(vm, *param[i]);
			}
			if (SQ_SUCCEEDED(sq_call(vm, numparams, result ? SQTrue:SQFalse, SQTrue))) {
				if (result) {
					sq_getvariant(vm, -1, result);
					sq_pop(vm, 1); // result
				}
				sq_pop(vm, 2); // func, root
			} else {
				sq_pop(vm, 2); // func, root
				SQEXCEPTION(vm);
			}
		} else {
			sq_pop(vm, 1); // root
			SQEXCEPTION(vm);
		}
		return S_OK;
	}

	
	/**
	 * squirrel スクリプトのコンパイル処理
	 * @param text スクリプトが格納された文字列
	 * @store store バイナリクロージャ格納先ファイル
	 * @throw コンパイルに失敗
	 * @throw 書き出しに失敗
	 * @return エラー文字列または void
	 */
	static tjs_error TJS_INTF_METHOD compile(tTJSVariant *result,
											 tjs_int numparams,
											 tTJSVariant **param,
											 iTJSDispatch2 *objthis)
	{
		if (numparams < 2) return TJS_E_BADPARAMCOUNT;
		SQInteger endian = numparams >= 3 ? (int)*param[3] : 0;
		if (SQ_SUCCEEDED(sq_compilebuffer(vm, param[0]->GetString(), param[0]->AsString()->GetLength(), L"TEXT", SQTrue))) {
			if (SQ_SUCCEEDED(sqstd_writeclosuretofile(vm, param[1]->GetString(), endian))) {
				sq_pop(vm, 1);
			} else {
				sq_pop(vm, 1);
				SQEXCEPTION(vm);
			} 
		} else {
			SQEXCEPTION(vm);
		}
		return TJS_S_OK;
	}
	
	/**
	 * squirrel の名前空間に登録
	 * @param name オブジェクト名
	 * @param obj オブジェクト
	 */
	static tjs_error TJS_INTF_METHOD registerSQ(tTJSVariant *result,
											  tjs_int numparams,
											  tTJSVariant **param,
											  iTJSDispatch2 *objthis)
	{
		if (numparams < 1) return TJS_E_BADPARAMCOUNT;
		if (numparams > 1) {
			registerglobal(vm, param[0]->GetString(), *param[1]);
		} else {
			tTJSVariant var;
			TVPExecuteExpression(param[0]->GetString(), &var);
			registerglobal(vm, param[0]->GetString(), var);
		}
		return TJS_S_OK;
	}

	/**
	 * squirrel の名前空間から削除
	 * @param name オブジェクト名
	 * @param obj オブジェクト
	 */
	static tjs_error TJS_INTF_METHOD unregisterSQ(tTJSVariant *result,
												tjs_int numparams,
												tTJSVariant **param,
												iTJSDispatch2 *objthis)
	{
		if (numparams < 1) return TJS_E_BADPARAMCOUNT;
		unregisterglobal(vm, param[0]->GetString());
		return TJS_S_OK;
	}

	/**
	 * @return squirrelのスレッド数を返す
	 */
	static tjs_error TJS_INTF_METHOD getThreadCount(tTJSVariant *result,
													  tjs_int numparams,
													  tTJSVariant **param,
													  iTJSDispatch2 *objthis)
	{
		if (result) {
			*result = sqobject::Thread::getThreadCount();
		}
		return TJS_S_OK;
	}

	/**
	 * Squirrel用比較
	 * 2つのオブジェクトを squirrel 的に比較します
	 * @param obj1 オブジェクトその1
	 * @param obj2 オブジェクトその2
	 * @return 比較結果 >0: obj1>obj2 ==0:obj1==obj2 <0:obj1<obj2
	 */
	static tjs_error TJS_INTF_METHOD compare(tTJSVariant *result,
											 tjs_int numparams,
											 tTJSVariant **param,
											 iTJSDispatch2 *objthis)
	{
		if (numparams < 2) return TJS_E_BADPARAMCOUNT;
		if (result) {
			sq_pushvariant(vm, *param[0]);
			sq_pushvariant(vm, *param[1]);
			*result = sq_cmp(vm);
			sq_pop(vm, 2);
		}
		return TJS_S_OK;
	}
};

//
// sq register callback
//

// sq print

static void printFunc(HSQUIRRELVM v, const SQChar* format, ...)
{
	TCHAR msg[1024];
	va_list args;
	va_start(args, format);
	_vsntprintf_s(msg, 1024, _TRUNCATE, format, args);

	TCHAR *p = msg;
	int c;
	int n = 0;

	while ((c = *(p+n)))
	{
		if (c == '\n')
		{
			TVPAddLog(ttstr(p,n));
			p += n;
			n = 0;
			p++;
		}
		else
		{
			n++;
		}
	}
	if (n > 0)
	{
		TVPAddLog(ttstr(p));
	}
	va_end(args);
}

static void PreRegistCallback()
{
	// sq init
	vm = sqobject::init();
	
	// sq print
	sq_setprintfunc(vm, printFunc);

	// sq register
	sq_pushroottable(vm);
	sqstd_register_iolib(vm);
	sqstd_register_bloblib(vm);
	sq_pop(vm, 1);
	
	sqobject::Object::registerClass();
	sqobject::Thread::registerClass();
	sqobject::Thread::registerGlobal();

	TJSObject::init(vm);
	
	sqobject::Thread::init();
 	sqobject::registerContinuous();
	
	iTJSDispatch2 * global = TVPGetScriptDispatch();
	if (global)
	{
		// tjs -> sq
		{
			tTJSVariant result;
			sq_pushroottable(vm);
			sq_getvariant(vm, -1, &result);
			sq_pop(vm, 1);
			global->PropSet(TJS_MEMBERENSURE, SQUIRREL_GLOBAL, NULL, &result, global);
		}
		tTJSVariant var(global, global);
		registerglobal(vm, KIRIKIRI_GLOBAL, var); // sq -> tjs
		global->Release();
	}
}

static void PostUnregistCallback()
{	
	iTJSDispatch2 * global = TVPGetScriptDispatch();
	if (global)
	{
		unregisterglobal(vm, KIRIKIRI_GLOBAL);
		global->DeleteMember(0, SQUIRREL_GLOBAL, NULL, global);
		global->Release();
	}

	// sq deinit
	sqobject::doneContinuous();
	sqobject::Thread::done();

	TJSObject::done(vm);

	sqobject::done();
}

//
// sq continuous
//

class SQContinuous : public tTVPContinuousEventCallbackIntf
{

protected:
	// 内部オブジェクト参照保持用
	HSQOBJECT obj;

public:
	/**
	 * コンストラクタ
	 * @param name 名称
	 */
	SQContinuous(const tjs_char* name) {
		sq_resetobject(&obj);          // ハンドルを初期化
		sq_pushroottable(vm);
		sq_pushstring(vm, name, -1);
		if (SQ_SUCCEEDED(sq_get(vm, -2))) { // ルートテーブルから関数を取得
			sq_getstackobj(vm, -1, &obj); // 位置-1からオブジェクトハンドルを得る
			sq_addref(vm, &obj);          // オブジェクトへの参照を追加
			sq_pop(vm, 2);
		}
		else {
			sq_pop(vm, 1);
			SQEXCEPTION(vm);
		}
	}

	/**
	 * デストラクタ
	 */
	~SQContinuous() {
		stop();
		sq_release(vm, &obj);
	}

	/**
	 * 呼び出し開始
	 */
	void start() {
		stop();
		TVPAddContinuousEventHook(this);
	}

	/**
	 * 呼び出し停止
	 */
	void stop() {
		TVPRemoveContinuousEventHook(this);
	}

	/**
	 * Continuous コールバック
	 * 吉里吉里が暇なときに常に呼ばれる
	 */
	virtual void TJS_INTF_METHOD OnContinuousCallback(tjs_uint64 tick) {
		sq_pushobject(vm, obj);
		sq_pushroottable(vm);
		sq_pushinteger(vm, (SQInteger)tick); // 切り捨て御免
		if (SQ_SUCCEEDED(sq_call(vm, 2, SQFalse, SQTrue))) {
			sq_pop(vm, 1);
		}
		else {
			stop();
			sq_pop(vm, 1);
			SQEXCEPTION(vm);
		}
	}
};

// 
// sq function
//

class SQFunction
{

protected:
	// 内部オブジェクト参照保持用
	HSQOBJECT obj;

public:
	/**
	 * コンストラクタ
	 * @param name 名称
	 */
	SQFunction(const tjs_char* name) {
		sq_resetobject(&obj);          // ハンドルを初期化
		sq_pushroottable(vm);
		sq_pushstring(vm, name, -1);
		if (SQ_SUCCEEDED(sq_get(vm, -2))) { // ルートテーブルから関数を取得
			sq_getstackobj(vm, -1, &obj); // 位置-1からオブジェクトハンドルを得る
			sq_addref(vm, &obj);          // オブジェクトへの参照を追加
			sq_pop(vm, 2);
		}
		else {
			sq_pop(vm, 1);
			SQEXCEPTION(vm);
		}
	}

	/**
	 * デストラクタ
	 */
	~SQFunction() {
		sq_release(vm, &obj);
	}

	/**
	 * ファンクションとして呼び出し
	 */
	static tjs_error TJS_INTF_METHOD call(tTJSVariant* result,
		tjs_int numparams,
		tTJSVariant** param,
		SQFunction* objthis) {
		sq_pushobject(vm, objthis->obj); // func
		sq_pushroottable(vm); // this
		for (int i = 0; i < numparams; i++) { // 引数
			sq_pushvariant(vm, *param[i]);
		}
		if (SQ_SUCCEEDED(sq_call(vm, numparams + 1, result ? SQTrue : SQFalse, SQTrue))) {
			if (result) {
				sq_getvariant(vm, -1, result);
				sq_pop(vm, 1); // result
			}
			sq_pop(vm, 1); // func
		}
		else {
			sq_pop(vm, 1); // func
			SQEXCEPTION(vm);
		}
		return TJS_S_OK;
	}
};