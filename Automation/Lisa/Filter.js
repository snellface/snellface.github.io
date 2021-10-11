$(document).ready(function () {
	var pList = [];
	var dList = [];

	$('#PList').bind("paste", function (e) {
		$('#PList').val("");

		let pastedData = e.originalEvent.clipboardData.getData('text');
		pList = parsePList(pastedData);
		if (pList.length > 0 && dList.length > 0) {
			let response = matchData(pList, dList);
			$('#ResultList').val(response);
		}

		$('#DList').parents("div.accordion-item").find("button").click(); // Hack ;)
		setTimeout(function () { // Hack ;)
			$('#DList').focus();
		}, 10);
	});

	$('#DList').bind("paste", function (e) {
		$('#DList').val("");

		let pastedData = e.originalEvent.clipboardData.getData('text');
		dList = parseDList(pastedData);
		if (pList.length > 0 && dList.length > 0) {
			let response = matchData(pList, dList);
			$('#ResultList').val(response);
		}

		$('#ResultList').parents("div.accordion-item").find("button").click(); // Hack ;)
		setTimeout(function () { // Hack ;)
			$('#ResultList').focus();
		}, 10);
	});
});


function matchData(pList, dList) {
	let output = "";

	let i = 0;
	for (let p of pList) {
		output += `${p.raw}\t`;

		let matchingRow = dList.find(d => d.id === p.id);
		if (typeof matchingRow !== 'undefined') {
			output += matchingRow.doctor;
		}

		output += "\n";
	}
	return output;
}

function parsePList(input) {
	let data = [];
	let rows = input.split('\n');
	for (let row of rows) {
		if (row.trim().length === 0)
			continue;

		let columns = row.split('\t');
		let idCol = columns[0].trim();
		if (idCol.length === 0)
			break;

		data.push({
			id: idCol,
			raw: row.trim(),
		});
	}

	return data;
}

function parseDList(input) {
	let data = [];
	let rows = input.split('\n');
	for (let row of rows) {
		if (row.trim().length === 0)
			continue;

		let columns = row.trim().split('\t');
		if (columns.length < 2)
			continue;

		data.push({
			id: columns[0].trim(),
			doctor: columns[1].trim()
		});
	}

	return data;
}