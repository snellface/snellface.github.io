$(document).ready(function () {
	var pList = [];
	var dList = [];

	$('#missingIdOutputContainer').hide();

	$('#PList').bind("paste", function (e) {
		$('#PList').val("");

		let pastedData = e.originalEvent.clipboardData.getData('text');
		pList = parsePList(pastedData);
		if (pList.length > 0 && dList.length > 0) {
			let data = compareData(pList, dList);
			let response = formatData(data);
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
			let data = compareData(pList, dList);
			let response = formatData(data);
			$('#ResultList').val(response, );
		}

		$('#ResultList').parents("div.accordion-item").find("button").click(); // Hack ;)
		setTimeout(function () { // Hack ;)
			$('#ResultList').focus();
		}, 10);
	});
});


function compareData(pList, dList) {
	let output = {
		rows: [],
		missingIdOrNull: null,
	};

	let i = 0;

	for (let p of pList) {
		let d;
		// Count up d interator until a match is found or the list is exausted.
		while (i < dList.length) {
			d = dList[i++];
			// Match found
			if (d.id === p.id) {
				output.rows.push(d);
				break;
			}
		}
	}

	if (output.rows.length < pList.length) {
		output.missingIdOrNull = pList[output.rows.length].id;
	}

	console.log(`found ${output.length} matches`);

	return output;
}

function formatData(data) {
	let response = "";
	$('#missingIdOutputContainer').hide();

	if (data.missingIdOrNull !== null) {
		$('#missingIdOutputContainer').show();
		$('#missingIdDisplay').text(data.missingIdOrNull);
		$('#missingIdRow').text(data.rows.length + 1);
	}

	for (let row of data.rows) {
		response += `${row.id}\t${row.doctor}\n`;
	}
	return response;
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
			id: idCol
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