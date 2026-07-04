/*document.addEventListener('DOMContentLoaded', function () {
    // 1. Toggle deep dropdown on click
    const subDropdownLinks = document.querySelectorAll('.dropdown-menu .dropdown > a');

    subDropdownLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // CRITICAL: Stops Bootstrap from closing the main dropdown

            const parentLi = this.closest('.dropdown');
            parentLi.classList.toggle('active');

            const chevron = this.querySelector('.toggle-dropdown');
            if (chevron) {
                chevron.classList.toggle('bi-chevron-down');
                chevron.classList.toggle('bi-chevron-up');
            }
        });
    });

    // 2. Reset nested dropdowns when the main dropdown is closed
    const mainDropdowns = document.querySelectorAll('.nav-item.dropdown');

    mainDropdowns.forEach(function (dropdown) {
        // Listen to Bootstrap's hide/hidden event
        dropdown.addEventListener('hidden.bs.dropdown', function () {
            // Find all active deep dropdowns inside this closed main menu
            const activeSubDropdowns = this.querySelectorAll('.dropdown.active');

            activeSubDropdowns.forEach(function (sub) {
                // Remove the active class to hide the sub-menu
                sub.classList.remove('active');

                // Reset the chevron icon back to pointing down
                const chevron = sub.querySelector('.toggle-dropdown');
                if (chevron) {
                    chevron.classList.remove('bi-chevron-up');
                    chevron.classList.add('bi-chevron-down');
                }
            });
        });
    });
});*/

// Toggle scrolled state on the navbar
const navbar = document.querySelector('.navbar');

function handleScroll() {
    if (window.scrollY > 40) { // If scrolled past the top bar height (40px)
        navbar.classList.add('select-scrolled');
    } else {
        navbar.classList.remove('select-scrolled');
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll); // Runs on load in case page is reloaded scrolled-down

// Isotope-style filtering for menu items
const filterTabs = document.querySelectorAll('.filter-tab');
const menuItems = document.querySelectorAll('.menu-item');

filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
        // 1. Remove active state from all tabs and add it to the clicked tab
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        // 2. Loop through all menu cards and show/hide them based on category class
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

// Testimonial Carousel
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

//On Scroll Active Nav-bar

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
