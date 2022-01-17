//---------------------------------------------------------------------------
// TJS2 Script
//---------------------------------------------------------------------------
#ifndef TJSSCRIPTENGINE_H
#define TJSSCRIPTENGINE_H

#include "tjsNative.h"

//---------------------------------------------------------------------------
// 
//---------------------------------------------------------------------------
extern ttstr TJS_StartupScript;

extern void TJS_InitScriptEngine();
extern void TJS_UninitScriptEngine();
extern void TJS_RestartScriptEngine();
extern tTJS* TJS_GetScriptEngine();

//---------------------------------------------------------------------------
// tTJSNC_ScriptEngine : TJS ScriptEngine class
//---------------------------------------------------------------------------
namespace TJS
{
	// ----------------------------------------------------------------------
	class tTJSNC_ScriptEngine : public tTJSNativeClass
	{
	public:
		tTJSNC_ScriptEngine();
	private:
		static tjs_uint32 ClassID;
	};
	// ----------------------------------------------------------------------
}	// namespace TJS

//---------------------------------------------------------------------------
#endif
