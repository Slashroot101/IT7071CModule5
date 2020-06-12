$(document).ready((e) => {
	$('#anamolyFile').on('change', (e) => {
		//make sure file is txt file
		const fileType = e.target.files[0].name.replace(/^.*\./, '');
		if(fileType !== 'txt'){
			$('#errLabel').html('You must only upload txt files!');
			return;
		}
		$('#errLabel').html('');
		readTextFromFile(e.target.files[0], (text) => {
			const splitText = text.split('\n');
			if(splitText.length === 0){
				$('#errLabel').html('This file contains no data to check!');
				return;
			}
			//this is kind of weird to filter like this, but there is a blank entry that messes up the casting
			const castedText = splitText.filter(x => x !== '').map(x => Number.parseFloat(x));
			const anomolies = findAnamolies(castedText);
			$('#inputForm').css('display', 'none');
			const displayArray = anomolies
																	.map(x => {
																		return `Remove ${x.x} from array because it's ${(x.x / x.std).toFixed(2)} times of standard deviation without it.`;
																	})
																	.join('\n');
			$('#displayForm').show();
			$('#result').html(displayArray === '' ? 'No anomolies found! ' : displayArray);
			console.log(anomolies)
		});
	});

	$('#newFileButton').click((e) => {
		$('#displayForm').css('display', 'none');
		$('#anamolyFile').val('');
		$('#inputForm').show();
	});
});

/**
 * 
 * @param {Array} data the data to check for anamolies
 */
function findAnamolies(data){
	let anamolies = [];
	for(let i = 0; i < data.length; i++){
		const sumOfElements = data.reduce((a, b) => a + b, 0) - data[i];
		const mu = sumOfElements / data.length - 1;
		const std = math.std(data.filter((x, index) => index !== i));
		if(data[i] - mu > std * 3){
			anamolies.push({x: data[i], std, mu});
		}
	}
	return anamolies
}

/**
 * 
 * @param {*} file the file to read
 * @param {*} callback callback for when the filereader is done
 */
function readTextFromFile(file, callback) {
	const fileReader = new FileReader();
	fileReader.onerror = err => {throw err};
	fileReader.onload = (e) => {
		callback(e.target.result);
	};
	fileReader.readAsText(file);
}
