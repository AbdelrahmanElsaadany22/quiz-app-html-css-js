let countSpan=document.querySelector(".quiz-info .count span")
let bulletsSpanContainer=document.querySelector('.bullets .spans')
let quizArea=document.querySelector(".quiz-area")
let answersArea=document.querySelector(".answers-area")
let submitButton=document.querySelector(".submit-button")
let bullets=document.querySelector(".bullets")
let resultsContainer=document.querySelector('.results')
let countDownElement=document.querySelector(".countdown")
//set Options
let currentIndex=0;
let rightAnswers=0;
let countDownIntereval;




function getQuestion(){
    let myRequest=new XMLHttpRequest();

    myRequest.onreadystatechange=function(){
        if(this.readyState===4 && this.status===200){
            let questionObject=JSON.parse(this.responseText)
            let questionsCount=questionObject.length;
            //create Bullets + question count
            createBullets(questionsCount)
            addQuestionData(questionObject[currentIndex],questionsCount)
            
            //start count down
            countDown(5,questionsCount)
            //click on submit
            submitButton.onclick=()=>{
                //get right answer
                let theRightAnwser=questionObject[currentIndex].right_answer;
                //increase index to show the next question
                currentIndex++;
                //check the answer
                checkAnswer(theRightAnwser,questionsCount)

                //reomve previous ques;
                quizArea.innerHTML="";
                answersArea.innerHTML="";
                addQuestionData(questionObject[currentIndex],questionsCount)

                //handle the active class (pullets)
                handleBullets()
                clearInterval(countDownIntereval)
                countDown(5,questionsCount)
                //show the result
                showResult(questionsCount)
            }
        }
    }
    myRequest.open("GET","html-questions.json",true)
    myRequest.send()
}

getQuestion();

function createBullets(num){
    countSpan.innerHTML=num;
    //create the spans of bullet
    for(let i=0;i<num ;i++){
        //create bullet
        let bullet=document.createElement("span")
        if (i===0){
            bullet.className="on";
        }
        //append bullet to the main bullet container
        bulletsSpanContainer.appendChild(bullet)

    }
}

function addQuestionData(obj,count){
   if(currentIndex<count){
     // create the H2 (title)
     let questionTitle=document.createElement("h2")
     //create the text of the question
     let questionText=document.createTextNode(obj["title"]);
     //add this text to the title
     questionTitle.appendChild(questionText);
     //add the title to the quiz area
     quizArea.appendChild(questionTitle);
 
     //create the answers
     for (let i=1;i<=4;i++){
         //create main answer div
         let mainDiv=document.createElement("div")
         //add class to the main div
         mainDiv.className="answer"
 
         //create radio input
         let radioInput=document.createElement("input");
         radioInput.type="radio"
         radioInput.name="question"
         radioInput.id=`answer_${i}`
         radioInput.dataset.answer=obj[`answer_${i}`]
 
         //make first is selectd
         if(i===1){
             radioInput.checked=true;
         }
 
 
         //create label
         let theLabel=document.createElement("label")
         
         theLabel.htmlFor=`answer_${i}`;
 
         //create label text
         let theLabelText=document.createTextNode(obj[`answer_${i}`])
 
         //add the text to label
         theLabel.appendChild(theLabelText)
 
         //append the input + label to main div
         mainDiv.appendChild(radioInput);
         mainDiv.append(theLabel);
         
         answersArea.appendChild(mainDiv)
 
 
     }
   }
}
function checkAnswer(rAnswer,count){
    let answers=document.getElementsByName("question")
    let theChoosenAnswer;
    for(let i=0;i<answers.length;i++){
        if(answers[i].checked){
            theChoosenAnswer=answers[i].dataset.answer;
        }
    }
    if(rAnswer===theChoosenAnswer){
        rightAnswers++;
    }
}

function handleBullets(){
    let bulletsSpans=document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans=Array.from(bulletsSpans)
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex===index){
            span.className="on";
        }
    })

}

function showResult(count){
    let theResult;
    if(currentIndex===count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
    if(rightAnswers > (count/2) && rightAnswers < count){
        theResult=`<span class="good">Good</span> ,${rightAnswers} From ${count} Is Good Average`
    }
    else if(rightAnswers===count){
        theResult=`<span class="perfect">Perfect</span> ,${rightAnswers} From ${count} Is Perfect Average`
    }
    else{
         theResult=`<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad Average`
    }
    resultsContainer.innerHTML=theResult
    resultsContainer.style.padding="10px"
    resultsContainer.style.backgroundColor="white"
    resultsContainer.style.marginTop="10px"
}
}


function countDown(duration,count){
    if (currentIndex < count ){
        let minutes,seconds
        countDownIntereval=setInterval(function(){
            minutes=parseInt(duration / 60);
            seconds=parseInt(duration % 60)

            minutes=minutes < 10 ? `0${minutes}` :minutes 
            seconds=seconds < 10 ? `0${seconds}` :seconds 

            countDownElement.innerHTML=`${minutes}:${seconds}`
            if(--duration < 0){
                clearInterval(countDownIntereval)
                submitButton.click()
            }

        },1000)
    }
}