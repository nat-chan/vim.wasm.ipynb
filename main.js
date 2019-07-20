import{VimWasm,checkBrowserCompatibility,VIM_VERSION}from"./vimwasm.js";const queryParams=new URLSearchParams(window.location.search);const debugging=queryParams.has("debug");const perf=queryParams.has("perf");const feature=queryParams.get("feature")||"normal";const extraArgs=feature==="normal"?["/home/web_user/tryit.py"]:[];const cmdArgs=extraArgs.concat(queryParams.getAll("arg"));const clipboardAvailable=navigator.clipboard!==undefined;let vimIsRunning=false;function fatal(err){if(typeof err==="string"){err=new Error(err)}alert("FATAL: "+err.message);throw err}{const compatMessage=checkBrowserCompatibility();if(compatMessage!==undefined){fatal(compatMessage)}}const screenCanvasElement=document.getElementById("vim-screen");const workerScriptPath=feature==="normal"?"./vim.js":`./${feature}/vim.js`;const vim=new VimWasm({canvas:screenCanvasElement,input:document.getElementById("vim-input"),workerScriptPath:workerScriptPath});screenCanvasElement.addEventListener("dragover",e=>{e.stopPropagation();e.preventDefault();if(e.dataTransfer){e.dataTransfer.dropEffect="copy"}},false);screenCanvasElement.addEventListener("drop",e=>{e.stopPropagation();e.preventDefault();if(e.dataTransfer===null){return}vim.dropFiles(e.dataTransfer.files).catch(fatal)},false);vim.onVimInit=(()=>{vimIsRunning=true});if(!perf){vim.onVimExit=(status=>{vimIsRunning=false;alert(`Vim exited with status ${status}`)})}if(!perf&&!debugging){window.addEventListener("beforeunload",e=>{if(vimIsRunning){e.preventDefault();e.returnValue=""}})}vim.onFileExport=((fullpath,contents)=>{const slashIdx=fullpath.lastIndexOf("/");const filename=slashIdx!==-1?fullpath.slice(slashIdx+1):fullpath;const blob=new Blob([contents],{type:"application/octet-stream"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.style.display="none";a.href=url;a.rel="noopener";a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)});function clipboardSupported(){if(clipboardAvailable){return undefined}alert("Clipboard API is not supported by this browser. Clipboard register is not available");return Promise.reject()}vim.readClipboard=(()=>{return clipboardSupported()||navigator.clipboard.readText()});vim.onWriteClipboard=(text=>{return clipboardSupported()||navigator.clipboard.writeText(text)});vim.onTitleUpdate=(title=>{document.title=title});vim.onError=fatal;vim.start({files:{'/home/web_user/.vim/vimrc':'set expandtab tabstop=4 shiftwidth=4 softtabstop=4\ncolorscheme onedark\nsyntax enable\nset number\nset clipboard=unnamedplus\n\nfunction! g:Send() abort range\n\tlet txt = getline(a:firstline, a:lastline)\n    let templete = [\n    \\"var txt = function(){/*",\n    \\"*/}.toString().slice(14,-4)",\n    \\"var cell = Jupyter.notebook.insert_cell_below()",\n    \\"cell.set_text(txt);",\n    \\"cell.execute();"]\n\tlet templete = templete[0:0] + txt +templete[1:]\n\tcall writefile(templete, "/tmp/out.js")\n\tsilent !/tmp/out.js\nendfunction\n\nvmap <S-CR> :call Send()<CR>\nnmap <S-CR> :%call Send()<CR>\n','/home/web_user/tryit.py':'# WELCOME TO LIVE DEMO OF https://github.com/nat-chan/vim.wasm.ipynb !\n#\n# - press Shift-Enter in normal mode to execute the entire file.\n# - To execute selected part, you can also use Shift-Enter in visual mode.\n#\n# please see ~/tryit.js or ~/.vim/vimrc for more information.\n# Enjoy! (U\'ω\')\n\nimport plotly.express as px\niris = px.data.iris()\nfig = px.scatter_3d(iris,\n        x="sepal_length",\n        y="sepal_width",\n        z="petal_width",\n        color="species")\nfig.show()\n'},debug:debugging,perf:perf,clipboard:clipboardAvailable,persistentDirs:["/home/web_user/.vim"],cmdArgs:cmdArgs});if(debugging){window.vim=vim;console.log("main: Vim version:",VIM_VERSION)}