

let mybutton = document.getElementById("top-bottomBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//-----------------------------------------------------

var slideIndex = 0;
carousel();
function carousel() {
    var slides = document.querySelectorAll('.image-grid');
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = 'flex';
    setTimeout(carousel, 3000);
}

//--------------------------------------
function openProfile() {
  document.getElementById('profileContainer').style.display = 'block';
}

function closeProfile() {
  document.getElementById('profileContainer').style.display = 'none';
}















