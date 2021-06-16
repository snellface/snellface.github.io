$(function () {
	$('#input').change(function () {
		inputChangedHandler();
	});

	$('#input').bind('paste', function () {
		setTimeout(function () {
			$('#input').change();
		}, 50);
	});

	function inputChangedHandler() {
		let input = $('#input').val();
		let output = convert(input);
		$('#output').val(output);
	}
});

function convert(input) {
	// Params are set like this:
	// DECLARE @state CHAR(25);  
	// SET @state = N'Oregon'; 
	// Remember GUID is UNIQUEIDENTIFIER in TSQL

	let lines = input.split('\n');

	console.log(lines);

	let declarations = "";
	let command = "";

	for (let line of lines) {
		let trimmedLine = line.trim();
		// Skip empty lines
		if (trimmedLine.length === 0)
			continue;

		if (trimmedLine.startsWith('-- p__linq__')) {
			let splitLine = line.split(' ');
			let name = splitLine[1].slice(0, -1); // Remove final ":"
			let value = splitLine[2].slice(1, -1); // Remove initial and final "'"
			let type = splitLine[5].slice(0, -1);// remove trailing "," or ")"
			declarations += getParamDeclareAndSet(name, type, value) + '\n\n';
		}
		else if (trimmedLine.startsWith('--')) // Remove any other comment present
			continue;
		else if (trimmedLine.startsWith('Closed connection at') || line.startsWith('Opened connection at'))
			continue;
		else
			command += line + '\n';
	}

	console.log(declarations);

	return `${declarations} \n\n${command}`;
}

function getParamDeclareAndSet(name, type, value) {
	// DECLARE @state CHAR(25);  
	// SET @state = N'Oregon'; 

	// from

	// --p__linq__0: '14' (Type = Single, IsNullable = false)
	// --p__linq__1: '2.8'(Type = Single, IsNullable = false)
	let tSqlTypeName = "";
	switch (type.toLowerCase()) {
		case "single":
			tSqlTypeName = "FLOAT";
			break;
		case "byte":
			tSqlTypeName = "INT";
			break;
		case "guid":
			tSqlTypeName = "UNIQUEIDENTIFIER"
			break;
		default:
			tSqlTypeName = type;
	}

	return `DECLARE @${name} ${tSqlTypeName}\nSET @${name} = '${value}'`;
}