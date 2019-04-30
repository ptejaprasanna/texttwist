var rack= "";
var rack_letter=[];
var all_words=[];
var number_words_remaining;
var guessed_words="";
var correct_words=[];
var correct_word_count=0;



function parseData(chuck){
    var data=JSON.parse(chuck);
    rack=data.tile;
    for(var i=0;i<rack.length;i++){
        rack_letter.push(rack.charAt(i));
    }
    all_words=data.words;
    number_words_remaining= all_words.length;
    console.log(all_words);
    document.getElementById("timed").disabled = false;
    document.getElementById("untimed").disabled = false;
}

function GetJson(){
      var URL = "backend.php";
      var xhr = new XMLHttpRequest();
  
     xhr.onload = function(){
    if (this.status == 200){
      parseData(this.response);
    }
  };
  
  xhr.open("GET", URL);
  xhr.send();
}
// var loadData = function(){
//   var URL = "backend.php";
//   var xhr = new XMLHttpRequest();
  
//   xhr.onload = function(){
//     if (this.status == 200){
//       console.log('more json', this.response);
//     }
//   };
  
//   xhr.open("GET", URL);
//   xhr.send();
// };

function display_remaining_guesses(){
    var $temp=document.getElementById('section-words-remaining');
    $temp.innerHTML='';
    var $remaining=document.createElement('p');
    var leftstring= "Words Remaining: " +(number_words_remaining-correct_word_count);
    $remaining.innerHTML= leftstring;
    $remaining.classList.add("remaining-words");
    $temp.appendChild($remaining);
    
}

function display_correct_words(){
  var $temp=document.getElementById('section-words');
  //document.getElementById('section-words').overflow="scroll";
  $temp.innerHTML='';
          //var $element=document.createElement('p');
          correct_words.forEach(function(cword){
          $temp.innerHTML+='<button class="btn btn-info" data-letter="'+cword+'">' +cword+ '</button>';
          //$element.classList.add("guess-letters");
          //$temp.appendChild(cword);
});
  
}

function check_guess(gword) {
    var ans_index=all_words.indexOf(gword);
    var correct_index= correct_words.indexOf(gword);
    if((ans_index>-1) && (correct_index==-1)){
        correct_words.push(gword);
        correct_word_count++;
    }
    console.log(correct_words);
}

function display_guess(){
    var $temp=document.getElementById('section-selection');
    $temp.innerHTML="";
    var $guess= document.createElement('p');
    $guess.innerHTML=guessed_words;
    $guess.classList.add("guess-letters");
    $temp.appendChild($guess);
}

function update_guess(alphabet){
    guessed_words = guessed_words.concat(alphabet);
    //alphabet.disabled=true;
    display_guess();
}

function display_button() {
    document.getElementById("timed").style.display = "none";
    document.getElementById("untimed").style.display = "none";
    document.getElementById("submit").style.display = "block";
    document.getElementById("clear").style.display = "block";
    display_rack();
    display_guess();
    //display_correct_words();
    display_remaining_guesses();
}

function timer_value(){
    var time_count=30;
    document.getElementById("timed").style.display = "none";
    document.getElementById("untimed").style.display = "none";
    document.getElementById("submit").style.display = "block";
    document.getElementById("clear").style.display = "block";
    display_rack();
    display_guess();
    //display_correct_words();
    display_remaining_guesses();
    time_count=time_count+5*number_words_remaining;
    var time_interval=setInterval(function(){
    var seconds=time_count%60;
    var minutes=Math.floor(time_count/60);
    var $temp=document.getElementById('game_timer');
    $temp.innerHTML='';
    var $p=document.createElement('p');
            var $tempstring=minutes+":"+seconds;
            $p.innerHTML= $tempstring;
            $p.classList.add("time-class");
            $temp.appendChild($p);
            console.log(minutes);
            console.log(seconds);

    //time_count=time_count-1;
    if(time_count--<0){
        alert("GAME OVER!!");
        clearInterval(time_interval);
    }
    },1000);
}

function display_rack(){
    var $temp=document.getElementById('section-racks');
    $temp.innerHTML='';
    rack_letter.forEach(function(rack_element){
        var $element=document.createElement('p');
        $element.innerHTML='<button class="btn btn-info" onclick="this.disabled=true" data-letter="'+rack_element+'">' +rack_element+ '</button>';
        $element.classList.add("letters");
        $element.addEventListener("click",function(event){
            update_guess(rack_element);
            //document.getElementsByClassName("p.letters").disabled=true;
        });
        $temp.appendChild($element);
        
       // $element.disabled=true;
        
    });
}

function submit_guess() {
    check_guess(guessed_words);
    guessed_words='';
    display_rack();
    display_correct_words();
    display_remaining_guesses();
    display_guess();
    
}

function clear_guess(){
    guessed_words='';
    display_rack();
    //display_correct_words();
    display_remaining_guesses();
    display_guess();
}

var start=function(){
    GetJson('backend.php');
    document.getElementById("submit").style.display = "none";
    document.getElementById("clear").style.display = "none";
    document.getElementById("timed").addEventListener('click',function(event){
        timer_value();
    });
    document.getElementById('untimed').addEventListener("click",function(event){
        display_button();
    });
    document.getElementById('submit').addEventListener("click",function(event) {
        submit_guess();
    });
    document.getElementById('clear').addEventListener("click",function(event) {
        clear_guess();
    });
    //var JSON_result=data;

};

document.addEventListener("DOMContentLoaded", start);
//let JSON = loadData();
//console.log('json: ', JSON)
