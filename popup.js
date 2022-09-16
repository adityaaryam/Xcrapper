// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});;
});


document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("emailDown").addEventListener("click", ehandler);
});
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("phoneDown").addEventListener("click", phandler);
});
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("allDown").addEventListener("click", allhandler);
});
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("reset").addEventListener("click", rehandler);
});
function downCSV(csv,type){
	if(csv.length!=0){
		var link = document.createElement('a');  
		link.textContent = "Save "+type+" as CSV.  ";
		link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
		link.target = '_blank';  
		link.download = 'Scrapped'+type+'.csv';
		document.body.appendChild(link);
	}
}
function ehandler(){
	let em=localStorage.getItem("email");
	let csv=em;
	downCSV(csv,'Emails')

}
function phandler(){
	let ph=localStorage.getItem("phone");
	let csv=ph;
	downCSV(csv,'Phone-Numbers')
}
function allhandler(){
	chrome.storage.sync.get(['allEmails'],function(result){
		if(result.allEmails!=null && result.allEmails.length!=0)
			downCSV(result.allEmails,'all Emails');
	});
	chrome.storage.sync.get(['allNums'],function(result){
		if(result.allNums!=null && result.allNums.length!=0)
			downCSV(result.allNums,'all Phone-Numbers');
	});
}
function rehandler(){
	chrome.storage.sync.set({'allEmails':[]});
	chrome.storage.sync.set({'allNums':[]});
}
// Listen to messages from the payload.js script and write to popout.html

chrome.runtime.onMessage.addListener(function (message) {
	var email=[],phone=[];
	if(message!=null)
	{
		let i=0;
		for(i;i<message.length;i++)
		{
			if(message[i]==='#')	break;
			email.push(message[i]);
		}
		i++;
		for(let j=i;j<message.length;j++)
		{
			if(message[j]==='#')	break;
			phone.push(message[j]);
		}

	}
	localStorage.setItem("email",email);
	localStorage.setItem("phone",phone)
	if(email.length==0)
		document.getElementById('emails').innerHTML = "No emails on this webpage.";
	else{
		document.getElementById('emails').innerHTML = email;
		chrome.storage.sync.get(['allEmails'],function(res){
			if(res.allEmails==null || res.allEmails.length==0)
				chrome.storage.sync.set({'allEmails':email});
			else{
				var newList=res.allEmails.concat(email);
				chrome.storage.sync.set({'allEmails':newList});
			}
		});
	}
	if(phone.length==0)
		document.getElementById('numbers').innerHTML = "No phone-numbers on this webpage.";
	else{
		document.getElementById('numbers').innerHTML = phone;
		chrome.storage.sync.get(['allNums'],function(res){
			if(res.allNums==null || res.allNums.length==0)
				chrome.storage.sync.set({'allNums':phone});
			else{
				var newList=res.allNums.concat(phone);
				chrome.storage.sync.set({'allNums':newList});
			}
		});
	}

});
