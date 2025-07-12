// Back to Top Button
(function() {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.title = 'Back to top';
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    function toggleBtn() {
        if (window.scrollY > 200) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }
    window.addEventListener('scroll', toggleBtn);
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
