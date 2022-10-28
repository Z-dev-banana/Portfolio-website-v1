let userInput, terminalOutput;
let projAsk = false;
let pathmade = false;
let lastCommands = [];
let username;
let path_map = {
  path : [],
  current_directory : "",
};

function path_obj(name, sd, parent) {
  this.name = name;
  this.sd = sd;
  this.parent = parent;
}

let base_path = new path_obj("C:", ["Users"], "none");
let user_base_path = new path_obj("Users",["none"],"C:");
let src_path = new path_obj("src", ["assets", "css", "js", "LICENSE.txt", "README.md", "index.html"], "none");
let asset_path = new path_obj("assets",["img", "favicon.ico", "favicon-old.ico"],"src");
let img_path = new path_obj("img",["email-1367-1133939.png", "Linkedin-Logo-2011-2019.png"],"assets");
let css_path = new path_obj("css", ["style.css"], "src");
let js_path = new path_obj("js", ["float-particles.js", "scripts.js", "terminal.js", "tiles.js"], "src");

const UNLOCK = {
  help : true,
  echo : false,
  pwd : false,
  cd : false,
  ls : false,
  username : true,
  history : false,
  github : false,
  exit : false,
};

const DISABLED = {
  help : false,
  echo : false,
  pwd : false,
  cd : false,
  ls : false,
  username : false,
  history : false,
  github : false,
  exit : false,
};

const command_list = ["help", "echo", "pwd", "cd", "ls", "username", "history", "github", "exit"];
const command_desc = ["<br>Usage: <code>help [command]</code><br><br> The <code>help</code> command can also be used by itself to get general info on all available commands.<br>",
                      "<br><code>echo</code> is a simple command used to make the computer repeat and input given to it. <br> If you type <code>echo I'm dumb</code> the computer will output <code>I'm dumb</code>. <br>",
                      "<br>Usage: <code>pwd</code> <br><br> <code>pwd</code> is a simple command used to display the present working directory. <br>",
                      "<br>Usage: <code>cd [path]</code> <br><br> Allows user to change directory to another path. The file location must exist. <br>",
                      "<br>Usage: <code>ls</code> <br><br> Lists all subdirectories of current directory. <br>",
                      "<br> Usage: <code>username bobbyg</code><br><br> The <code>username</code> command is only used once to initially set your username. You do not need to remember your username, as of now this command has no extended functionality and will be disabled after inital use. <br> ",
                      "<br><code>history</code> is used to see previous commands. <br> Simply type <code>history</code> into the terminal to use. <br>",
                      "<br><code>github</code> redirectes the user to my GitHub page, as of now takes no secondary arguments.<br>",
                      "<br><code>exit</code> exits the current terminal session. <br>"
                    ];

const COMMANDS = {
  help: `list commands supported by this terminal`,
  echo: `repeats given arguments`,
  pwd: `shows current path`,
  cd: `changes current directory`,
  ls: `lists subdirectories and files`,
  username: `sets inital username`,
  history: `shows command history`,
  github: `go to my new GitHub page`, 
  exit: `close the terminal session`
};

const app = () => {
  if (sessionStorage.username !== undefined) {
    username = sessionStorage.username;
    lastCommands = sessionStorage.command.split(",");
    checkTerm();
  }
  userInput = document.getElementById("userInput");
  terminalOutput = document.getElementById("terminalOutput");
  document.getElementById("keyboard").focus();
};

const execute = async function executeCommand(input) {
  
  //console.log(sessionStorage);
  
  SessionUsernameState();
  
  lastCommands.push(input);
  let output;
  if (input.length === 0) {
    return;
  }
  if (input.indexOf("sudo") >= 0) {
    input = "sudo";
  }
  
  const inputWords = input.split(" ");
  inputWords[0] = inputWords[0].toLowerCase();

  if (input === "clear" || input === "cls") {
    clearScreen();
  } else {
    output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
    
     if (inputWords[0] === "help") {
      for (let i = 0; i < command_list.length; i++) {
           if (command_list[i] === inputWords[1]) {
              /*output += command_list[i];
              output += i;*/
              output += command_desc[i];
           }
      }
      if (inputWords.length === 1) {
        output = helpCommand(output);
      }
    } else if (inputWords[0] === "username") {
      if (DISABLED['username']) {
        output += COMMANDS['username'];
      } else if (inputWords[2]) {
        output += "Too many arguments";
      } else if (inputWords[1]) {
        output += "username accepted";
        username = inputWords[1];
        let user_path = new path_obj(username, ["resume-zach-strader.pdf","src"], "Users");
        src_path.parent = username;
        user_base_path.sd[0] = username;
        path_init(user_path);
        setSessionUsername(inputWords[1]);
      } else {
        output += "no username input";
      }
    } else if (inputWords[0] === "echo") {
      output = echo(inputWords, output);
    } else if (input === "history") {
      output += showHist();
    } else if (inputWords[0] === "pwd") { 
        if (UNLOCK['pwd']) {
          output += get_current_path();
        } else if (UNLOCK['pwd'] === false) {
          output += "Command is locked.";
        }
    } else if (inputWords[0] === "github") {
        open("https://github.com/Z-dev-banana");
        output += 'redirecting...';
    } else if (inputWords[0] === "cd") {
      if (inputWords.length === 2) {
        output += change_directory(inputWords[1]);
      } else if (inputWords.length > 2) {
        output += "Too many arguments for this command";
      } else if (inputWords.length === 1) {
        output += "'cd' command needs argument. <br> Type <code>help cd</code> if you need help with this command.";
      }
    } else if (inputWords[0] === "ls") {
      if (inputWords.length === 1 ) {
        output += list_subdirectories();
      }
    } else if (inputWords[0] === "exit") {
      if (UNLOCK['exit']) {
        output += 'exiting terminal window...';
        
        sessionStorage.exitFlag = true;
      } else {
        output += "Cannot exit until a USERNAME is entered.";
      }
      
    } else if (!COMMANDS.hasOwnProperty(input)) {
      output += `<div class="terminal-line">command not found: ${input}</div>`;
    } else {
      output += COMMANDS[input];
    }

    terminalOutput.innerHTML = `${terminalOutput.innerHTML}<br><div class="terminal-line">${output}<br></div>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    if (output.includes("exiting terminal window...")) {
      console.log("in exit if")
      await sleep(1250);
      exit();
    }
    SessionUsernameState();
  }
};

const key = (e) => {
  const input = userInput.innerHTML;

  if (e.key === "Enter") {
    execute(input);
    userInput.innerHTML = "";
    return;
  }

  userInput.innerHTML = input + e.key;
};

const backspace = (e) => {
  if (e.keyCode !== 8 && e.keyCode !== 46) {
    return;
  }
  userInput.innerHTML = userInput.innerHTML.slice(
    0,
    userInput.innerHTML.length - 1
  );
};

const spacebar = (e) => {
  if (e.keyCode === 32) {
    e.preventDefault();
  }
};

const esc = (e) => {
  if (e.key === "Escape") {
    if (UNLOCK['exit']) {
      checkTerm();
    } else {
      userInput.innerHTML = "Cannot exit until a USERNAME is entered."
      document.dispatchEvent(new KeyboardEvent('keypress', {'key' : 'Enter'}))
    }
  }
};

function terminalOpen() {
  sessionStorage.hits=Number(sessionStorage.hits)+1;
   if (sessionStorage.hits > 0 && document.getElementById('terminal').style.display === 'none'){
    document.getElementById('terminal').style.display='block';
  }
}

function checkTerm() {
  if (Number(sessionStorage.hits) > 0) {
    document.getElementById('terminal').style.display='none';
  }
}

function helpCommand(output) {
  output += `<div class="terminal-line">The help command can be used to get more detailed information about the commands listed below. Type "help" then the command you have the question about e.g., <code>help username</code> if you need help with the username command. </div><br>`;
  for (let x in COMMANDS) {
    for (let y in UNLOCK) {
      if (y === x && UNLOCK[y] === true) {
        output += `<div class="terminal-line">${x + " -- " + COMMANDS[x]}</div>`;
      } else if (y === x && UNLOCK[y] === false) {
        console.log(UNLOCK[y] + " : " + y)
        output += `<div class="terminal-line">${"??? -- " + COMMANDS[x]}</div>`;
      }
    }
  }
  return output;
}

function showHist() {
  return lastCommands.join(", ")
}

function echo(inputWords, output) {
  for (var i = 1; i < inputWords.length; i++) {
    output += inputWords[i] + " ";
  }
  return output;
}

function get_current_path() {
  return path_map.current_directory;
}


// Javascript recursive function!! :O
function set_current_path(current_path_obj) {
  path_map.current_directory = current_path_obj.name + "\\" + path_map.current_directory;
  for (let i = 0; i < path_map.path.length; i++) {
    if (path_map.path[i].name === current_path_obj.parent) {
      if (path_map.path[i].parent != "none") {
        set_current_path(path_map.path[i]);
      } else if (path_map.path[i].parent === "none") {
        path_map.current_directory = path_map.path[i].name + "\\" + path_map.current_directory;
      }
    }
  }
}

function path_init(user_obj) {
  path_map.path.push(base_path, user_base_path, user_obj, src_path, asset_path, img_path, css_path, js_path);
  set_current_path(user_obj);
  pathmade = true;
}

// new_name is only the argument used with the 'cd' command
function change_directory(new_name) {
  if (new_name.slice(0, 2) === "..") {
    if (username === find_current_path_obj()) {
      return `Access to folder is denied.`;
    } else {
      for (let e = 0; e < path_map.path.length; e++) {
        console.log(find_current_path_obj());
        if (path_map.path[e].name === find_current_path_obj()) {
          if (new_name === path_map.path[e].parent) {
            console.log(new_name + path_map.path[e].parent);
          } else {
            for (let r = 0; r < path_map.path.length; r++) {
              if (path_map.path[e].parent === path_map.path[r].name) {
                path_map.current_directory = "";
                set_current_path(path_map.path[r]);
                return `Directory changed to ${path_map.current_directory}`;
              }
            }
          }
        }
      }
    }
  }
  temp_path = path_map.current_directory;
  for (let i = 0; i < path_map.path.length; i++){
    for (let t = 0; t < path_map.path[i].sd.length; t++) {
      if (path_map.path[i].sd[t] === new_name) {
        path_map.current_directory = path_map.current_directory + new_name + "\\";
        return path_map.current_directory;
      }
    }
  }

  if (temp_path === path_map.current_directory) {
    return `No directory '${new_name}' found in this location.`;
  }
}

function list_subdirectories() {
  obj_name = find_current_path_obj();
  console.log(obj_name);
  let all_sds = "";
  for (let i = 0; i < path_map.path.length; i++) {
    if (path_map.path[i].name === obj_name) {
      for (let t = 0; t < path_map.path[i].sd.length; t++) {
        all_sds = all_sds + "<br>" + path_map.path[i].sd[t];
      }
    }
  }
  if (all_sds === ""){
    return "Directory is empty."
  } else {
    return all_sds;
  }
  
}

function find_current_path_obj(){
  now_path = path_map.current_directory.split("\\");
  now_path = now_path[now_path.length - 2];
  return now_path;
}

function exit() {
  const Terminal = document.getElementById('terminal');
  Terminal.style.display='none';
}

function SessionUsernameState() {
  if (username !== undefined) {
    var index = "username";
    COMMANDS[index] = "username has been set, command is now disabled.";
    DISABLED[index] = true;
    UNLOCK['history'] = true;
    UNLOCK['exit'] = true;
    UNLOCK['pwd'] = true;
    sessionStorage.command = [];
    sessionStorage.command = lastCommands;
    
    if (!pathmade) {
      let user_path = new path_obj(username, ["resume-zach-strader.pdf","src"], "Users");
      src_path.parent = username;
      user_base_path.sd[0] = username;
      path_init(user_path);
    }
    
  }
  
  if (sessionStorage.exitFlag == "true") {
    UNLOCK['github'] = true;
  }
}

function setSessionUsername(user) {
  sessionStorage.hits = 0;
  sessionStorage.exitFlag = false;
  sessionStorage.username = user;
  sessionStorage.hits=Number(sessionStorage.hits)+1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let iter = 0;
const up = (e) => {
  if (e.key === "ArrowUp") {
    if (lastCommands.length > 0 && iter < lastCommands.length) {
      iter += 1;
      userInput.innerHTML = lastCommands[lastCommands.length - iter];
    }
  }

  if (e.key === "ArrowDown") {
    if (lastCommands.length > 0 && iter > 1) {
      iter -= 1;
      userInput.innerHTML = lastCommands[lastCommands.length - iter];
    }
  }
};

function clearScreen() {
  location.reload();
}
document.addEventListener("keydown", up);

document.addEventListener("keydown", backspace);
document.addEventListener("keypress", key);
document.addEventListener("keypress", spacebar);
document.addEventListener("keydown", esc);
document.addEventListener("DOMContentLoaded", app);

class Terminal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://kit.fontawesome.com/3f2db6afb6.js" crossorigin="anonymous"></script>
    <div class="terminal_window" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>
    
    <div class="fakeScreen">
      <div class="terminal-window primary-bg" onclick="document.getElementById('dummyKeyboard').focus();">
        <div class="terminal-output" id="terminalOutput">
          <div class="terminal-line">
            <span class="help-msg">Enter a <span class="help">USERNAME</span> to get into the site or type <span class="help">HELP</span> if you need more information.</span>
            <br>
          </div>
        </div>
        <div class="terminal-line">
          <span class="success">➜</span>
          <span class="directory">~</span>
          <span class="user-input" id="userInput"></span>
          <span class="line anim-typewriter"></span>
          <input type="text" id="keyboard" class="dummy-keyboard" />
        </div>
      </div>
    </div>
  </div>
  `
  }
}

customElements.define("terminal-js", Terminal);
