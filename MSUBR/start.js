"use strict";

(function () {
	
	function Start()
	{
		window.cr_createRuntime({
			exportType: "windows-webview2"
		});
	};
	
	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", Start);
	else
		Start();
	
})();