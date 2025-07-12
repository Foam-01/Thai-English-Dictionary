// Sakura Extra Features: Word Count, Random Word of the Day, Sakura Petal Animation

document.addEventListener('DOMContentLoaded', function() {
    // 1. Word Count
    const table = document.querySelector('.word-list table');
    if (table) {
        const count = table.querySelectorAll('tbody tr').length;
        const wordCountDiv = document.getElementById('word-count');
        if (wordCountDiv) {
            wordCountDiv.textContent = `📚 คำศัพท์ทั้งหมด: ${count} คำ`;
        }
    }

    // 2. Random Word of the Day
    function getRandomInt(max) { return Math.floor(Math.random() * max); }
    function getTodaySeed() {
        const now = new Date();
        return now.getFullYear() * 10000 + (now.getMonth()+1) * 100 + now.getDate();
    }
    function seededRandom(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    const rows = table ? Array.from(table.querySelectorAll('tbody tr')) : [];
    if (rows.length > 0) {
        const seed = getTodaySeed();
        const idx = Math.floor(seededRandom(seed) * rows.length);
        const tds = rows[idx].querySelectorAll('td');
        const word = tds[0]?.textContent || '';
        const pronounce = tds[1]?.textContent || '';
        const meaning = tds[2]?.textContent || '';
        const randomWordText = document.getElementById('randomWordText');
        if (randomWordText) {
            randomWordText.innerHTML = `<b>${word}</b> <span style='color:#b45a8d;'>(${pronounce})</span> = <span style='color:#a13c7a;'>${meaning}</span>`;
        }
    }

    // 3. Sakura Petal Animation
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (6 + Math.random() * 5) + 's';
        petal.style.opacity = 0.7 + Math.random() * 0.3;
        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 12000);
    }
    setInterval(createPetal, 900);
});
