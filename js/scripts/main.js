/*
	***************
	**	Elements **
	***************
*/
const uploaderFileInput = document.getElementById("uploaderFileInput");
const fileNameSpan = document.getElementById("fileNameSpan");

const extractorArrow = document.getElementById("extractorArrow");
const extractorImage = document.getElementById("extractorImage");

const languageSelector = document.getElementById("languageSelector");
const extractedTextField = document.getElementById("extractedTextField");
const copyExtractedText = document.getElementById("copyExtractedText");

let isTextBeingExtracted = false;
let extractionStatus = "";


/*
	*********************
	** Event Listeners **
	*********************
*/
uploaderFileInput.addEventListener("change", () => {
	const fileName = uploaderFileInput.files[0].name;
	const fileFormat = uploaderFileInput.files[0].type.split("/")[1];
	const acceptedFileFormat = ["png", "jpg", "jpeg", "avif", "jfif", "webp"];
	extractedTextField.innerHTML = "";

	// If value is in a accepted file format, the file name
	// is shown into "fileNameSpan" and the image is displayed
	if (acceptedFileFormat.includes(fileFormat)) {
		fileNameSpan.textContent = fileName;

		const file = uploaderFileInput.files[0];
		const reader  = new FileReader();
		reader.onload = function(e)  { extractorImage.src = e.target.result; }
    	reader.readAsDataURL(file);
	}

	// Else, nothing is shown, the input value is reseted,
	// the image container is reseted and a toast message is thrown
	else {
		fileNameSpan.textContent = "";
		uploaderFileInput.value = "";
		extractorImage.src = "";

		VanillaToasts.create({
      		title: "File Format Not Accepted",
      		text: "Only png, jpg, jpeg, avif and jfif image formats are supported!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	};
});

extractorArrow.addEventListener("click", () => {
	// show a toast message when there are any uploaded files
	if (uploaderFileInput.value === "") {
		VanillaToasts.create({
      		title: "There Are Any Uploaded Files",
      		text: "You must upload a file before trying to extract text!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}

	// when a text is already being extracted, show a toast
	// message to notify the user
	else if (isTextBeingExtracted) {
		VanillaToasts.create({
      		title: "A Text is Already Being Extracted",
      		text: "An extraction is already running, please, wait untill the end!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}

	// extract text from image when there are an uploaded file
	// and any text is being extracted
	else {
		isTextBeingExtracted = true;
		const worker = new Tesseract.TesseractWorker();

		worker.recognize(uploaderFileInput.files[0], languageSelector.value)
			.progress(function(packet){
			    extractionStatus = `${packet.status}...`;
			    extractedTextField.innerHTML = extractionStatus;
			})
			.then(function(data){			    
			    const text = data.text.replace(/\n\s*\n/g, '\n');
			    extractedTextField.innerHTML = text;
			    isTextBeingExtracted = false;
			});
	}
});

copyExtractedText.addEventListener("click", () => {
	// if there are any extracted text, a toast message is shown
	if (extractedTextField.innerHTML === "") {
		VanillaToasts.create({
      		title: "No Text to Copy",
      		text: "There are any extracted text to copy!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}

	// if there are text being extracted, a toast message is shown
	else if (isTextBeingExtracted) {
		VanillaToasts.create({
      		title: "Text Being Extracted",
      		text: "Wait the text be fully extracted before copying it!",
      		type: "warning", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}

	// else, the extracted is copyed to the client clipboard
	else {
		navigator.clipboard.writeText(extractedTextField.innerHTML);

		VanillaToasts.create({
      		title: "Copied Text",
      		text: "Copied text to the clipboard!",
      		type: "success", // warning, error, info, success
      		icon: "./assets/logo.avif",
      		timeout: 3500
    	});
	}
});