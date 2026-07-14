
const navbar = document.querySelector('.navbar');

function handleScroll() {
    if (window.scrollY > 40) {
        navbar.classList.add('select-scrolled');
    } else {
        navbar.classList.remove('select-scrolled');
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

const filterTabs = document.querySelectorAll('.filter-tab');
const menuItems = document.querySelectorAll('.menu-item');

filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        const currentItems = document.querySelectorAll('.menu-item');
        currentItems.forEach(function (item) {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = "none";
            }
        });

    });
});

const api_url = "http://127.0.0.1:8000"
const user_login = document.getElementById("login");
const username = document.getElementById("profileName");

async function loadProfile() {
    const token = localStorage.getItem('user_access_token');
    if (!token) return;
    try {
        const res = await fetch(`${api_url}/auth/profile`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        if (res.ok) {
            const data = await res.json();
            if (username) {
                username.innerText = data.username;
            }
        }
    }
    catch (err) {
        console.error("Error loading profile:", err);
    }
}

if (user_login) {
    const token = localStorage.getItem("user_access_token");
    const link = user_login.querySelector("a");

    const ifInUserSide = window.location.pathname.includes("/user_side/");

    const loginPageUrl = ifInUserSide ? "user_login.html" : "user_side/user_login.html";

    if (token) {
        link.innerText = "Logout";
        link.href = "#";
        link.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("user_access_token");
            window.location.href = loginPageUrl;
        });
        loadProfile();
    } else {
        link.innerText = "Login";
        link.href = loginPageUrl;
        if (username) {
            username.innerText = "Account";
        }
    }
}

const carouselEl = document.getElementById('testimonialCarousel');

if (carouselEl) {
    const testimonialCarousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);

    carouselEl.querySelector('.carousel-control-prev').addEventListener('click', function () {
        testimonialCarousel.prev();
    });

    carouselEl.querySelector('.carousel-control-next').addEventListener('click', function () {
        testimonialCarousel.next();
    });
}


$(window).on('scroll', function () {
    var scrollPos = $(window).scrollTop() + 100;
    $('section[id], footer[id]').each(function () {
        var sectionTop = $(this).offset().top;
        var sectionBottom = sectionTop + $(this).outerHeight();
        var sectionId = $(this).attr('id');
        if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
            $('.navbar-nav .nav-link').removeClass('active');
            $('.navbar-nav li a[href="#' + sectionId + '"]').addClass('active');
        }
    });
});

