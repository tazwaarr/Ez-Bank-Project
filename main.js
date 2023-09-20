// Import Tokens and Payload
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-app.js";
import {getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/9.17.0/firebase-database.js";

// Point our DB to the one that we have set up in Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_0HAKM82D_lPRElDefZW7qidwO1Ddc9Q",
  authDomain: "ezbank-b0dda.firebaseapp.com",
  projectId: "ezbank-b0dda",
  storageBucket: "ezbank-b0dda.appspot.com",
  messagingSenderId: "467686370722",
  appId: "1:467686370722:web:113aec92ff0e7d0caf56fb",
  measurementId: "G-7RVSTB17P8"
};

// When App Launched do this
window.onload = function(){
   const app = initializeApp(firebaseConfig);
   const db = getDatabase();
   const dbref = ref(db);


// Connect HTML Elements to JS (IDS)
 document.getElementById('swithToReg').onclick=switchToReg;
 document.getElementById('swithToLogin').onclick=switchTologin;
 document.getElementById('login-btn').onclick = loginValidation;
 document.getElementById('register-btn').onclick = registerValidation;


//------switch to registration path-----//
function switchToReg(){
 document.getElementById('register-portal').style = "display:inline-block";
 document.getElementById('login-portal').style = "display:none";
}
function switchTologin(){
 document.getElementById('register-portal').style = "display: none ";
 document.getElementById('login-portal').style = "display:inline-block";
}


//---acc no and pin pattern-----//
var accNoPat = "^[0-9]{6}$";
var accPinPat = "^[0-9]{4}$";
//----login validation------//
function loginValidation(){
 var lAccNo = document.getElementById('lAccNo').value;
 var lAccPin = document.getElementById('lAccPin').value;
 if(lAccNo.match(accNoPat) && lAccPin.match(accPinPat)){
   portal(lAccNo,lAccPin);
 }else{
     alert("Please enter valid details");
 }
}


//-----Register validation----------//
function registerValidation(){
var rAccName = document.getElementById('rAccName').value;
var rAccNo = document.getElementById('rAccNo').value;
var rAccPin = document.getElementById('rAccPin').value;
var rConAccPin = document.getElementById('rConAccPin').value;
if(rAccName!==null && rAccNo.match(accNoPat) && rAccPin.match(accPinPat) && rAccPin == rConAccPin){

  //Example of API Request to update DB with new user
  set(ref(db,"accNo "+rAccNo+"/accPin "+rAccPin+"/accDetails"),{
    name: rAccName,
    avalBal: 0
  }).then(()=>{
    alert("Registered");
  }).catch((error)=>{
    alert("Failed\n"+error);
  });

  set(ref(db,"accNo "+rAccNo+"/received"),{
    receivedAmt: 0
  }).then(()=>{
    console.log("Success");
  }).catch((error)=>{
    alert("Fail\n"+error);
  });
}else{
 alert("Try Again!");
}
}


//----------------------------Portal----------------------------//
function portal(accNo,accPin){
 document.getElementById('login-portal').style = "display:none";
 document.getElementById('register-portal').style = "display:none";
 document.getElementById('portal').style = "display:inline-block";

 var name,avalBal,totalBal,receivedAmt,msg;

 //-----------getting data from firebase------------//
get(child(dbref,"accNo "+accNo+"/accPin "+accPin+"/accDetails")).then((snapshot)=>{
 if(snapshot.exists()){
    name = snapshot.val().name;
    avalBal = snapshot.val().avalBal;
    document.getElementById('userName').innerHTML = 'Hi '+name;
 }else{
   alert("no data");
 }
}).catch((error)=>{
 alert("error: \n"+error);
});

get(child(dbref,"accNo "+accNo+"/received")).then((snapshot)=>{
 if(snapshot.exists()){
     receivedAmt = snapshot.val().receivedAmt;
     totalBal = avalBal + receivedAmt;
     msg="Hey!, "+name;
     updateAvalBal(msg,totalBal);
     updateReceivedAmt();
 }else{
   alert("fail");
 }
}).catch((error)=>{
 alert("error: \n"+error);
});


//----------update values in firebase----------------//
function updateAvalBal(msg,totalBal){
  update(ref(db,"accNo "+accNo+"/accPin "+accPin+"/accDetails"),{
    avalBal: totalBal
  }).then(()=>{
    alert(msg);
    document.getElementById('totalBal').innerHTML = "TotalBal: "+totalBal;
  }).catch((error)=>{
    alert("error\n"+error);
  });
}
  function updateReceivedAmt(){
     update(ref(db,"accNo "+accNo+"/received"),{
       receivedAmt: 0
     }).then(()=>{
       console.log("Sucess!");
     }).catch((error)=>{
       alert("error\n"+error);
     });
}


//-------------deposit--------------------///
document.getElementById('deposit-btn').addEventListener('click',deposit);

function deposit(){
 document.getElementById('deposit-portal').style= "display:inline-block";
 document.getElementById('withdraw-portal').style= "display:none";
 document.getElementById('transfer-portal').style= "display:none";

 document.getElementById('dep-submit').addEventListener('click',function(){
   document.getElementById('deposit-btn').removeEventListener('click',deposit);
   var depositAmt = Number(document.getElementById('deposit-amt').value);
   if(depositAmt>=10){
     totalBal += depositAmt;
     document.getElementById('deposit-amt').value = '';
     msg = "$. "+depositAmt+" was successfully depoisted";
     updateAvalBal(msg,totalBal);
   }else{
     alert('Minimum deposit amount $10');
   }
 });
}


///-------------withdraw---------------///
document.getElementById('withdraw-btn').addEventListener('click',withdraw);
function withdraw(){
 document.getElementById('deposit-portal').style= "display:none ";
 document.getElementById('withdraw-portal').style= "display:inline-block";
 document.getElementById('transfer-portal').style= "display:none";

 document.getElementById('wit-submit').addEventListener('click',function(){
   document.getElementById('withdraw-btn').removeEventListener('click',deposit);
   var withdrawAmt = Number(document.getElementById('withdraw-amt').value);
   if(withdrawAmt>=10){
     totalBal -= withdrawAmt;
     document.getElementById('withdraw-amt').value = '';
     msg = "$ "+withdrawAmt+" was successfully withdrawn";
     updateAvalBal(msg,totalBal);
   }else{
     alert('Minimum withdraw amount is $10');
   }
 });
}


//-----------------transfer------------------//
document.getElementById('transfer-btn').addEventListener('click',transfer);
function transfer(){
 document.getElementById('deposit-portal').style= "display:none ";
 document.getElementById('withdraw-portal').style= "display:none";
 document.getElementById('transfer-portal').style= "display:inline-block";

 document.getElementById('trans-submit').addEventListener('click',function(){

   document.getElementById('transfer-btn').removeEventListener('click',transfer);

   var transAccNo = document.getElementById('transfer-acc-no').value;
   var transferAmt = Number(document.getElementById('transfer-amt').value);

   document.getElementById('transfer-acc-no').value = '';
   document.getElementById('transfer-amt').value = '';

   if(transAccNo.match(accNoPat) && transferAmt>=10){

     update(ref(db,"accNo "+transAccNo+"/received"),{
       receivedAmt: transferAmt
     }).then(()=>{
       totalBal -= transferAmt;
       document.getElementById('withdraw-amt').value = '';
       msg = "$ "+transferAmt+" was successfully transfer to "+transAccNo;
       updateAvalBal(msg,totalBal);
     }).catch((error)=>{
       alert('error\n'+error);
     });
   }else{
     alert('Minimum withdraw amount $10');
   }
 });
 }
}

}