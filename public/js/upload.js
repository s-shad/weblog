document.getElementById("imageUpload").onclick = function () {
	let xhttp = new XMLHttpRequest(); // create new AJAX request

	const selectedImage = document.getElementById("selectedImage");
	const imageStatus = document.getElementById("imageStatus");
	const progressBar = document.getElementById("progressBar");
	const progressDiv = document.getElementById("progressDiv");

	xhttp.onreadystatechange = function () {
		imageStatus.innerHTML = this.responseText;
	};

	xhttp.upload.onprogress = function (e) {
		if (e.lengthComputable) {
			let result = Math.floor((e.loaded / e.total) * 100);
			if (result !== 100) {
				progressBar.innerHTML = result + "%";
				progressBar.style = "width:" + result + "%";
				console.log(result + "%");
			} else {
				progressDiv.style = "display:none";
			}
		}
	};

	xhttp.open("POST", "/dashboard/image-upload");
	let formData = new FormData();

	if (selectedImage.files.length > 0) {
		progressDiv.style = "display:block	";
		formData.append("image", selectedImage.files[0]);
		xhttp.send(formData);
	} else {
		imageStatus.innerHTML = "برای آپلود باید عکسی انتخاب کنید";
	}
};
