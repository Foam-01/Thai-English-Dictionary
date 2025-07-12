document.addEventListener('DOMContentLoaded', function() {
// ฟีเจอร์: Row click effect, highlight, real-time search, copy, tooltip, dark mode, count, random word
document.addEventListener('DOMContentLoaded', function() {
    // Row click effect
    document.querySelectorAll('.word-list table tbody tr').forEach(function(row) {
        row.addEventListener('click', function() {
            row.classList.add('clicked');
            setTimeout(function() {
                row.classList.remove('clicked');
            }, 400);
        });
    });
});

    // Highlight search (if any)
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        document.querySelectorAll('.word-list td').forEach(function(td) {
            if (td.textContent.toLowerCase().includes(q.toLowerCase())) {
                td.classList.add('highlight');
            }
        });
    }

    // Add search box, count, random, dark mode toggle

    const wordListSection = document.querySelector('.word-list');
    if (!wordListSection) return;
    const table = wordListSection.querySelector('table');
    if (!table) return;

    // --- Search box ---
    let searchBarContainer = document.getElementById('lux-search-bar');
    let searchDiv = searchBarContainer || document.createElement('div');
    searchDiv.style.display = 'flex';
    searchDiv.style.justifyContent = 'space-between';
    searchDiv.style.alignItems = 'center';
    searchDiv.style.marginBottom = '18px';
    if (searchBarContainer) searchBarContainer.innerHTML = '';

    // Search input
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'ค้นหาคำศัพท์...';
    searchInput.className = 'lux-search-input';
    searchInput.style.padding = '10px 18px';
    searchInput.style.fontSize = '1.08rem';
    searchInput.style.borderRadius = '20px';
    searchInput.style.border = '2px solid #ffd70099';
    searchInput.style.outline = 'none';
    searchInput.style.marginRight = '16px';
    searchInput.style.minWidth = '180px';

    // Count
    const countSpan = document.createElement('span');
    countSpan.style.fontWeight = '600';
    countSpan.style.color = '#ffd700';
    countSpan.style.marginRight = '16px';

    // Random button
    const randomBtn = document.createElement('button');
    randomBtn.textContent = '🔀 สุ่มคำ';
    randomBtn.className = 'lux-quick-link';
    randomBtn.style.padding = '7px 18px';
    randomBtn.style.fontSize = '1.08rem';
    randomBtn.style.marginRight = '10px';

    // Flashcard button
    const flashBtn = document.createElement('button');
    flashBtn.textContent = '🃏 Flashcard';
    flashBtn.className = 'lux-quick-link';
    flashBtn.style.padding = '7px 18px';
    flashBtn.style.fontSize = '1.08rem';
    flashBtn.style.marginRight = '10px';

    // Add all buttons to searchDiv (ไม่ใส่ reverseBtn)
    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(countSpan);
    searchDiv.appendChild(randomBtn);
    searchDiv.appendChild(flashBtn);
    if (!searchBarContainer) wordListSection.insertBefore(searchDiv, table);

    // --- Real-time search ---
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    function filterTable() {
        const val = searchInput.value.trim().toLowerCase();
        let shown = 0;
        let found = false;
        rows.forEach(row => {
            let match = false;
            let tds = Array.from(row.querySelectorAll('td'));
            if (val) {
                // ปกติ: ค้นหาทุกคอลัมน์ (ไม่ต้อง reverse)
                if ((tds[0] && tds[0].textContent.toLowerCase().includes(val)) ||
                    (tds[1] && tds[1].textContent.toLowerCase().includes(val)) ||
                    (tds[2] && tds[2].textContent.toLowerCase().includes(val))) {
                    match = true;
                }
            } else {
                match = true;
            }
            row.style.display = match ? '' : 'none';
            if (match) shown++;
            if (match && val) found = true;
        });
        countSpan.textContent = `พบ ${shown} / ${rows.length} คำ`;
        // shake effect if not found
        if (val && !found) {
            table.classList.add('shake');
            setTimeout(()=>table.classList.remove('shake'), 500);
        }
    }
    searchInput.addEventListener('input', filterTable);
    filterTable();

    // --- Random word ---
    randomBtn.addEventListener('click', function() {
        const visibleRows = rows.filter(r => r.style.display !== 'none');
        if (visibleRows.length === 0) return;
        const idx = Math.floor(Math.random() * visibleRows.length);
        visibleRows[idx].scrollIntoView({behavior:'smooth',block:'center'});
        visibleRows[idx].classList.add('clicked');
        setTimeout(()=>visibleRows[idx].classList.remove('clicked'), 600);
    });


    // --- Flashcard ---
    flashBtn.addEventListener('click', function() {
        let visibleRows = rows.filter(r => r.style.display !== 'none');
        if (visibleRows.length === 0) return;
        let idx = 0;
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 9999;
        const card = document.createElement('div');
        card.style.background = '#fff';
        card.style.padding = '40px 60px';
        card.style.borderRadius = '18px';
        card.style.boxShadow = '0 4px 32px #3358e655';
        card.style.fontSize = '2rem';
        card.style.textAlign = 'center';
        card.style.color = '#3358e6';
        card.style.position = 'relative';
        overlay.appendChild(card);
        function showCard() {
            let tds = visibleRows[idx].querySelectorAll('td');
            card.innerHTML = `<b>${tds[0].textContent}</b><br><span style='font-size:1.2rem;color:#222'>${tds[1].textContent}</span><br><span style='font-size:1.2rem;color:#444'>${tds[2].textContent}</span>`;
        }
        showCard();
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) document.body.removeChild(overlay);
        });
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            idx = (idx+1)%visibleRows.length;
            showCard();
        });
        document.body.appendChild(overlay);
    });

    // --- Favorite/Bookmark, History, Copy, TTS, Share, Popup ---
    let favorites = JSON.parse(localStorage.getItem('dict-fav')||'[]');
    let history = JSON.parse(localStorage.getItem('dict-hist')||'[]');
    rows.forEach(row => {
        let tds = row.querySelectorAll('td');
        // เฉพาะแถวที่มีข้อมูลภาษาอังกฤษและไทยเท่านั้นถึงจะแสดงปุ่ม
        if (
            tds[0] && tds[0].textContent.trim() &&
            tds[2] && tds[2].textContent.trim()
        ) {
            // ลบปุ่มเดิม (ถ้ามี)
            if (row.lastElementChild.querySelector('.sakura-btn-group')) {
                row.lastElementChild.querySelector('.sakura-btn-group').remove();
            }
            // สร้างกลุ่มปุ่มใหม่
            let btnGroup = document.createElement('div');
            btnGroup.className = 'sakura-btn-group';
            btnGroup.style.display = 'flex';
            btnGroup.style.justifyContent = 'flex-end';
            btnGroup.style.alignItems = 'center';
            btnGroup.style.gap = '10px';
            btnGroup.style.width = 'auto';

            // Copy (sakura style)
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#ffe6f2 60%,#e3f0ff 100%);color:#b45a8d;border-radius:50%;box-shadow:0 2px 8px #f8bbd033;display:flex;align-items:center;justify-content:center;font-size:1.2rem;transition:background 0.18s,box-shadow 0.18s;"><span style="font-size:1.15rem;">📋</span></span>';
            copyBtn.title = 'คัดลอกแถวนี้';
            copyBtn.style.border = 'none';
            copyBtn.style.background = 'none';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.width = '32px';
            copyBtn.style.height = '32px';
            copyBtn.style.display = 'flex';
            copyBtn.style.alignItems = 'center';
            copyBtn.style.justifyContent = 'center';
            copyBtn.style.padding = '0';
            copyBtn.addEventListener('mouseenter', function() {
                copyBtn.firstChild.style.background = 'linear-gradient(135deg,#f8bbd0 60%,#b45a8d 100%)';
                copyBtn.firstChild.style.color = '#fff';
                copyBtn.firstChild.style.boxShadow = '0 4px 16px #f8bbd055';
            });
            copyBtn.addEventListener('mouseleave', function() {
                copyBtn.firstChild.style.background = 'linear-gradient(135deg,#ffe6f2 60%,#e3f0ff 100%)';
                copyBtn.firstChild.style.color = '#b45a8d';
                copyBtn.firstChild.style.boxShadow = '0 2px 8px #f8bbd033';
            });
            copyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (tds[1]) {
                    navigator.clipboard.writeText(tds[1].textContent);
                    copyBtn.firstChild.innerHTML = '✅';
                    setTimeout(()=>copyBtn.firstChild.innerHTML='📋', 900);
                }
            });
            btnGroup.appendChild(copyBtn);

            // TTS (sakura style)
            const ttsBtn = document.createElement('button');
            ttsBtn.innerHTML = '<span style="display:inline-block;width:32px;height:32px;background:linear-gradient(135deg,#ffe6f2 60%,#e3f0ff 100%);color:#b45a8d;border-radius:50%;box-shadow:0 2px 8px #f8bbd033;display:flex;align-items:center;justify-content:center;font-size:1.2rem;transition:background 0.18s,box-shadow 0.18s;"><span style="font-size:1.15rem;">🔊</span></span>';
            ttsBtn.title = 'ฟังเสียง';
            ttsBtn.style.border = 'none';
            ttsBtn.style.background = 'none';
            ttsBtn.style.cursor = 'pointer';
            ttsBtn.style.width = '32px';
            ttsBtn.style.height = '32px';
            ttsBtn.style.display = 'flex';
            ttsBtn.style.alignItems = 'center';
            ttsBtn.style.justifyContent = 'center';
            ttsBtn.style.padding = '0';
            ttsBtn.addEventListener('mouseenter', function() {
                ttsBtn.firstChild.style.background = 'linear-gradient(135deg,#f8bbd0 60%,#b45a8d 100%)';
                ttsBtn.firstChild.style.color = '#fff';
                ttsBtn.firstChild.style.boxShadow = '0 4px 16px #f8bbd055';
            });
            ttsBtn.addEventListener('mouseleave', function() {
                ttsBtn.firstChild.style.background = 'linear-gradient(135deg,#ffe6f2 60%,#e3f0ff 100%)';
                ttsBtn.firstChild.style.color = '#b45a8d';
                ttsBtn.firstChild.style.boxShadow = '0 2px 8px #f8bbd033';
            });
            ttsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                let utter = new SpeechSynthesisUtterance(tds[0].textContent);
                utter.lang = 'en-US';
                window.speechSynthesis.speak(utter);
            });
            btnGroup.appendChild(ttsBtn);

            // เพิ่มปุ่มโดยไม่ลบข้อมูลเดิม
            if (row.lastElementChild.childNodes.length > 0) {
                row.lastElementChild.appendChild(btnGroup);
            } else {
                row.lastElementChild.innerHTML = '';
                row.lastElementChild.appendChild(btnGroup);
            }
        } else {
            // ถ้าไม่มีข้อมูลภาษาอังกฤษหรือไทย ไม่ต้องแสดงปุ่ม
            row.lastElementChild.innerHTML = '';
        }
        // Popup detail
        row.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            let overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.background = 'rgba(0,0,0,0.5)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = 9999;
            let box = document.createElement('div');
            box.style.background = '#fff';
            box.style.padding = '32px 48px';
            box.style.borderRadius = '18px';
            box.style.boxShadow = '0 4px 32px #3358e655';
            box.style.fontSize = '1.3rem';
            box.style.textAlign = 'center';
            box.innerHTML = `<b style='font-size:2rem;color:#3358e6'>${tds[0].textContent}</b><br><span style='color:#222'>${tds[1].textContent}</span><br><span style='color:#444'>${tds[2].textContent}</span>`;
            overlay.appendChild(box);
            overlay.addEventListener('click', function(ev) {
                if (ev.target === overlay) document.body.removeChild(overlay);
            });
            document.body.appendChild(overlay);
        });
        // History
        row.addEventListener('click', function() {
            let word = tds[0].textContent;
            if (!history.includes(word)) {
                history.unshift(word);
                if (history.length > 30) history.pop();
                localStorage.setItem('dict-hist', JSON.stringify(history));
            }
        });
    });

    // --- Tooltip on hover ---
    rows.forEach(row => {
        row.querySelectorAll('td').forEach(td => {
            td.title = td.textContent;
        });
    });
});
