const mainCircle = document.querySelector('[gb-rotatingdisplay-element="parent"]');
const smallCircles = document.querySelectorAll('[gb-rotatingdisplay-element="child"]');
const mainWidth = mainCircle.offsetWidth;
const mainHeight = mainCircle.offsetHeight;
var radius = Math.min(mainHeight,mainWidth)/2;
const angle = (2 * Math.PI) / smallCircles.length;
var initialize = false;
var targetAngle = angle;
let rotationStep = 0;
const rotationStepInterval = angle / 25;
let activeClassUse = false;
let activeClassName = "";
const findActiveClass = document.querySelectorAll('[gb-rotatingdisplay-activeclass]');
if(findActiveClass.length > 0){
    if(findActiveClass.length>1){
        console.log("WARNING: gb-rotatingdisplay-activeclass found multiple times!");
    }
    else{
        activeClassName = mainCircle.getAttribute('gb-rotatingdisplay-activeclass');
        activeClassUse = true;
    }

}
setCircles();
rotationTimer();
for(let i = 0; i < smallCircles.length; i++){
    const element = smallCircles[i];
    element.onclick = function(){
        clickedRotation(i);
    }
}

function rotationTimer(){
    setInterval(function(){
        rotateMain();
    }, 15000);
}

function setCircles(){
    for (let i = 0; i < smallCircles.length; i++) {
        smallCircles[i].style.position = "fixed";
        smallCircles[i].style.transformOrigin = `center`;
        const x = Math.abs(Math.round(radius * Math.cos(i * angle) - mainCircle.offsetWidth/2)) -(smallCircles[i].offsetWidth/2);
        const y = Math.abs(Math.round(radius * Math.sin(i * angle) + mainCircle.offsetHeight/2)) -(smallCircles[i].offsetHeight/2);
        smallCircles[i].style.left = x+ "px";
        smallCircles[i].style.top = y  + "px";
    }
    if (!initialize) {
        mainCircle.style.transform = `rotate(${0}rad)`;
        mainCircle.style.transformOrigin = `center`;
        activeClass(0);
        initialize = true;
    }
}

function rotateMain() {
    removeClass()
    function rotationAnimation() {
        
        if (rotationStep >= targetAngle) {
            rotationStep = targetAngle;
            targetAngle = targetAngle + angle;
            if (targetAngle > angle * smallCircles.length) {
                targetAngle = angle;
                rotationStep = 0;
            }
            mainCircle.style.transform = `rotateZ(${rotationStep}rad)`;
            smallCircles.forEach(function(item){
                item.style.transform = `rotateZ(${-rotationStep}rad)`;
            })
            activeClass(targetAngle - angle);
        } else {
            rotationStep = rotationStep + rotationStepInterval;
            if (!(rotationStep >= targetAngle)) {
            mainCircle.style.transform = `rotateZ(${rotationStep}rad)`;
            smallCircles.forEach(function(item){
                item.style.transform = `rotateZ(${-rotationStep}rad)`;
            })
        }
            requestAnimationFrame(rotationAnimation);
        }
    }
    // Start the animation
    requestAnimationFrame(rotationAnimation);
}

function activeClass(value) {
    removeClass();
    const activeElementIndex = Math.round(value / angle) % smallCircles.length;
    const activeElement = smallCircles[activeElementIndex];
    if(activeClassUse == true){
        const directChildrenAdd = activeElement.children;
        directChildrenAdd[0].classList.add(activeClassName);
    }
    const attributeName = 'gb-rotatingdisplay-childname'; // replace with the actual attribute name
    const attributeValue = activeElement.getAttribute(attributeName);
    const displayedSection = document.querySelector(`[gb-rotatingdisplay-sectionname="${attributeValue}"]`);
    const elementsWithAttribute = document.querySelectorAll('[gb-rotatingdisplay-sectionname]');
    elementsWithAttribute.forEach(element => {
        element.style.display = "none";
      });
    displayedSection.style.display = "block";
}
function removeClass(){
    for(let i = 0; i<smallCircles.length; i++){
        if(activeClassUse == true){
            const directChildrenRemove = smallCircles[i].children;
            directChildrenRemove[0].classList.remove(activeClassName);
        }
    }
}
function clickedRotation(arrayItem){
    removeClass()
    const endLocation = arrayItem * angle;
    const startLocation = targetAngle;
    let distance = 0;
    distance = calculateDistance();

    function calculateDistance(){
        distance = endLocation - startLocation;
        if(distance <0){
            distance = (2 * Math.PI) + distance
        }
        return distance;
    }

    function clickedRotationAnimation() {
        targetAngle = startLocation + distance;
        if (rotationStep >= targetAngle) {
            if (targetAngle > angle * smallCircles.length) {
                targetAngle = targetAngle - (angle * smallCircles.length);
            }
            rotationStep = targetAngle;
            mainCircle.style.transform = `rotateZ(${rotationStep}rad)`;
            smallCircles.forEach(function(item){
                item.style.transform = `rotateZ(${-rotationStep}rad)`;
            })
            activeClass(endLocation);
        } 
        else {
            rotationStep = rotationStep + rotationStepInterval;
            if (!(rotationStep >= targetAngle)) {
            mainCircle.style.transform = `rotateZ(${rotationStep}rad)`;
            smallCircles.forEach(function(item){
                item.style.transform = `rotateZ(${-(rotationStep) }rad)`;
            })
        }
            requestAnimationFrame(clickedRotationAnimation);
        }
    }
    // Start the animation
    requestAnimationFrame(clickedRotationAnimation);
    
    
    
}

/* Document Info
element: main element - attach to parent element 
gb-rotatingdisplay-element="parent"

element: rotationg elements -attach to child elements (direct child of parent)
gb-rotatingdisplay-element="child"

attach to child elements
gb-rotatingdisplay-childname = "NAME"

attach to the wrapper of the section you want to display
gb-rotatingdisplay-sectionname = "NAME"

Option: active class - attach to the parent element
gb-rotatingdisplay-activeclass = "CLASSNAME"
*/