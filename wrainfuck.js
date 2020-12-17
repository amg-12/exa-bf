// For the latest Axiom VirtualNetwork+ scripting documentation, 
// please visit: http://www.zachtronics.com/virtualnetwork/

function getTitle() {
	return "BRAINFUCK";
}

function getSubtitle() {
	return "MAKE AN INTERPRETER";
}

function getDescription() {
	return "File 300 contains a brainfuck program. Execute it, reading input from #INPT and writing output to #OUTP. To help you, the 8 brainfuck keywords are available from additional registers.\n" +
		"Note: tape length will never exceed 999, and all values will be in the -9999..9999 range.";
}

function onCycleFinished() {
}

function initializeTestRun(testRun) {
    var host = createHost("CORE", 5, -2, 8, 8);
	var link = createLink(getPlayerHost(), 800, host, -1);

	var program = "";
	var inputs = [];
	var outputs = [];
	
	var i, j;

	switch (testRun) {
	case 1: // decrement input
		program = "+[>,-.<]";
		inputs = roll(30, -99, 999);
		outputs = inputs.map(function (x) { return x - 1; });
		break;
	
	case 2: // reverse input
		program = ">,[>,]<[.<]";
		inputs = roll(29, 1, 999);
		outputs = inputs.slice(0).reverse();
		inputs.push(0);
		break;

	case 3: // sort input
		program = ">>,[>>,]<<[[-<+<]>[>[>>]<[.[-]<[[>>+<<-]<]>>]>]<<]";
		inputs = roll(10, 1, 99);
		outputs = inputs.slice(0).sort(function (a, b) { return a - b; });
		inputs.push(0);
		break;
	
	case 4: // binary to decimal
		program = ">,+[>>>++++++++[<[<++>-]<+[>+<-]<-[-<]>>[-<]<,+>>>-]<.[-]<<]";
		// >,++[>>>++++++++[<[<++>-]<+[>+<-]<-[-[-<]>]>[-<]<,++>>>-]<.[-]<<];
		inputs = roll(24, 0, 1);
		for (i = 0; i < 3; ++i) {
			var total = 0;
			for (j = 0; j < 8; ++j)
				total = 2 * total + inputs[8 * i + j] % 2;
			outputs.push(total);
		}
		break;

	case 5: // Hello, World!
		program = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>->+>>+[<]<-]>>.>>---.+++++++..+++.>.<<-.>.+++.------.--------.>+.>++.";
		outputs = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 10];
		break;

	case 6: // brainfuck
		program = ">++++[>++++++<-]>-[[<+++++>>+<-]>-]<<[<]>>>>--.<<<-.>>>-.<.<.>---.<<+++.>>>++.<<---.[>]<<.";
		outputs = [98, 114, 97, 105, 110, 102, 117, 99, 107, 10];
		break;
	
	case 7: // spam 10s
		program = "++++++++++[>++++++++++>+<<-]>[>.<-]";
		outputs = roll(30, 10, 10);
		break;

	case 8: // fibonacci
		program = ".+[.[->+>+<<]>]";
		outputs = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];
		break;

	case 9: // powers of 2
		program = "+[.[->++<]>]";
		outputs = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
		break;

	case 10: // translate to bf
		program = "+++++[>+++++++++<-],[[>--.++>+<<-]>+.->[<.>-]<<,]";
		inputs = roll(3, 1, 5);
		for (i = 0; i < inputs.length; ++i) {
			for (j = 0; j < inputs[i]; ++j)
				outputs.push(43);
			outputs.push(46);
			for (j = 0; j < inputs[i]; ++j)
				outputs.push(45);
		}
		break;
	
	default:
		inputs = roll(30, -99, 999);
		for (i = 0; i < 30; ++i) {
			var a = randomInt(0, 9);
			var b = randomInt(0, 9);
			program += ",>" + "+++++++++".substr(0, a) + "[-<" + "---------".substr(0, b) + ">]<.";
			outputs.push(inputs[i] - a * b);
		}
		break;
	}

	program = program.split('');

	var tape = [];
	var dp = 0;
	var brackets = 0;

	for (i = 0; i < 1000; ++i)
		tape[i] = 0;

	createNormalFile(getPlayerHost(), 300, FILE_ICON_DATA, program);
	createTable("I/O", 110, -3, "Output as described");
	addTableInput("Input", inputs, createRegister(host, 7, 5, "INPT"));
	addTableOutput("Output", outputs, createRegister(host, 10, 5, "OUTP"));

	setRegisterReadCallback(createRegister(host, 5,  -2, "PLUS"), function () { return "+"; });
	setRegisterReadCallback(createRegister(host, 6,  -2, "MINS"), function () { return "-"; });
	setRegisterReadCallback(createRegister(host, 7,  -2, "LANG"), function () { return "<"; });
	setRegisterReadCallback(createRegister(host, 8,  -2, "RANG"), function () { return ">"; });
	setRegisterReadCallback(createRegister(host, 9,  -2, "LBRA"), function () { return "["; });
	setRegisterReadCallback(createRegister(host, 10, -2, "RBRA"), function () { return "]"; });
	setRegisterReadCallback(createRegister(host, 11, -2, "COMA"), function () { return ","; });
	setRegisterReadCallback(createRegister(host, 12, -2, "STOP"), function () { return "."; });
}

function roll(count, min, max) {
	var result = [];
	for (var i = 0; i < count; ++i)
		result.push(randomInt(min, max));
	return result;
}
