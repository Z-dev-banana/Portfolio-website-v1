let userInput, terminalOutput;
let projAsk = false;
let lastCommands = [];
let password;

const UNLOCK = {
  help : true,
  test : false,
  password : true,
  history : false,
  github : false,
  exit : false,
};

const DISABLED = {
  help : false,
  test : false,
  password : false,
  history : false,
  github : false,
  exit : false,
};

const command_list = ["help", "test", "password", "history", "github", "exit"];
const command_desc = [""];

const COMMANDS = {
  help: `list commands supported by this terminal`,
  test: `test command for listing`,
  password: `enter password in format 'password (your_password)'`,
  history: `shows command history`,
  github: `go to my new GitHub page`, 
  exit: `close the terminal session`
};

const app = () => {
  if (sessionStorage.password !== undefined) {
    password = sessionStorage.password;
    lastCommands = sessionStorage.command.split(",");
    checkTerm();
  }
  userInput = document.getElementById("userInput");
  terminalOutput = document.getElementById("terminalOutput");
  document.getElementById("keyboard").focus();
};

const execute = async function executeCommand(input) {
  
  SessionPasswordState();
  
  lastCommands.push(input);
  let output;
  if (input.length === 0) {
    return;
  }
  if (input.indexOf("sudo") >= 0) {
    input = "sudo";
  }
  
  const inputWords = input.split(" ");
  inputWords[0].toLowerCase();

  if (input === "clear" || input === "cls") {
    clearScreen();
  }  else if (input === "github") {
    open("https://github.com/Z-dev-banana");
    output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
    output += input;
  } else {
    output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
    
     if (inputWords[0] === "help") {
      for (let i = 0; i < command_list.length; i++;) {
           if (command_list[i] === inputWords[1]) {
              output += command_list[i];
           }
      }
      output = helpCommand(output);
    } else if (inputWords[0] === "password") {
      if (DISABLED['password']) {
        output += COMMANDS['password'];
      } else if (inputWords[2]) {
        output += "Too many arguments";
      } else if (inputWords[1]) {
        output += "password accepted - ";
        password = inputWords[1];
        setSessionPassword(inputWords[1]);
      } else {
        output += "no password input";
      }
    } else if (inputWords[0] === "echo") {
      output = echo(inputWords, output);
    } else if (input === "history") {
      output += showHist();
    } else if (input === "exit") {
      if (UNLOCK['exit']) {
        output += 'exiting terminal window...'
        
        sessionStorage.exitFlag = true;
      } else {
        output += "Cannot exit until PASSWORD is entered.";
      }
      
    } else if (!COMMANDS.hasOwnProperty(input)) {
      output += `<div class="terminal-line">command not found: ${input}</div>`;
    } else {
      output += COMMANDS[input];
    }

    terminalOutput.innerHTML = `${terminalOutput.innerHTML}<br><div class="terminal-line">${output}<br></div>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    console.log(sessionStorage.exitFlag)
    if (output.includes("exiting terminal window...")) {
      console.log("in exit if")
      await sleep(1250);
      exit();
    }
    SessionPasswordState();
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
      userInput.innerHTML = "Cannot exit until PASSWORD is entered."
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
  output += `<div class="terminal-line">The help command can be used to get more detailed information about the commands listed below.</div>`;
  output += `<div class="terminal-line">Type "help" then the command you have the question about e.g., <code>help password</code> if you need help with the password command. </div>`;
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

function exit() {
  const Terminal = document.getElementById('terminal');
  Terminal.style.display='none';
  console.log('in exit')
}

function SessionPasswordState() {
  if (password !== undefined) {
    var index = "password";
    COMMANDS[index] = "Password has been set, command is now disabled.";
    DISABLED[index] = true;
    UNLOCK['history'] = true;
    UNLOCK['exit'] = true;
    sessionStorage.command = [];
    sessionStorage.command = lastCommands;
  }
  
  if (sessionStorage.exitFlag == "true") {
    UNLOCK['github'] = true;
  }
}

function setSessionPassword(pass) {
  sessionStorage.hits = 0;
  sessionStorage.exitFlag = false;
  sessionStorage.password = pass;
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
            <span class="help-msg">Enter your <span class="help">PASSWORD</span> to get enter the site or <span class="help">HELP</span> for help.</span>
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
