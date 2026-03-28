$(document).ready(function() {
    let history = JSON.parse(localStorage.getItem('cleanHistory')) || [];
    let duplicates = [
        {id:1, name:"photo1.jpg", size:"3.2 MB", img:"https://picsum.photos/id/1015/300/300"},
        {id:2, name:"photo2.jpg", size:"3.1 MB", img:"https://picsum.photos/id/1016/300/300"},
        {id:3, name:"screenshot1.png", size:"2.5 MB", img:"https://picsum.photos/id/201/300/300"},
        {id:4, name:"screenshot2.png", size:"2.4 MB", img:"https://picsum.photos/id/202/300/300"}
    ];
    let selectedItems = new Set();

    // Render Analyzer
    function renderAnalyzer() {
        const breakdown = `
            <div class="d-flex justify-content-between mb-2"><span>Photos & Videos</span><span>45.8 GB</span></div>
            <div class="d-flex justify-content-between mb-2"><span>Apps & Data</span><span>25.3 GB</span></div>
            <div class="d-flex justify-content-between mb-2"><span>Duplicates & Junk</span><span>4.1 GB</span></div>
            <div class="d-flex justify-content-between"><span>Others</span><span>11.8 GB</span></div>
        `;
        $('#breakdown').html(breakdown);
    }

    // Render Duplicates (with swipe-like click selection)
    function renderDuplicates() {
        const $container = $('#duplicatesList');
        $container.empty();
        duplicates.forEach(item => {
            const $card = $(`
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card h-100" data-id="${item.id}">
                        <img src="${item.img}" class="card-img-top" alt="${item.name}">
                        <div class="card-body p-3">
                            <small class="d-block">${item.name}</small>
                            <small class="text-muted">${item.size}</small>
                        </div>
                    </div>
                </div>
            `);
            $card.find('.card').on('click', function() {
                const id = parseInt($(this).data('id'));
                if (selectedItems.has(id)) {
                    selectedItems.delete(id);
                    $(this).removeClass('selected');
                } else {
                    selectedItems.add(id);
                    $(this).addClass('selected');
                }
            });
            $container.append($card);
        });
    }

    function addToHistory(action, amount) {
        const entry = {
            time: new Date().toLocaleString(),
            action: action,
            amount: amount
        };
        history.unshift(entry);
        if (history.length > 15) history.pop();
        localStorage.setItem('cleanHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const $list = $('#historyList');
        $list.empty();
        history.forEach(item => {
            $list.append(`
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${item.action}</strong><br>
                        <small class="text-muted">${item.time}</small>
                    </div>
                    <span class="text-success fw-bold">+${item.amount}</span>
                </div>
            `);
        });
    }

    // Deep Clean
    $('#deepCleanBtn').on('click', function() {
        $('#usedSpace').text('82 GB');
        $('#freeSpace').text('46 GB');
        $('#usedBar').css('width', '64%');
        addToHistory('Deep Clean Completed', '5.2 GB');
        alert('Deep clean finished!\nFreed up 5.2 GB (simulation)');
    });

    // Delete selected duplicates
    $('#deleteSelectedBtn').on('click', function() {
        if (selectedItems.size === 0) {
            alert('Please select items to delete');
            return;
        }
        if (confirm(`Delete ${selectedItems.size} selected item(s)?`)) {
            duplicates = duplicates.filter(d => !selectedItems.has(d.id));
            selectedItems.clear();
            renderDuplicates();
            addToHistory('Duplicates Removed', '11.2 MB');
            alert('Selected duplicates removed (simulation)');
        }
    });

    // Compress button
    $('#compressBtn').on('click', function() {
        addToHistory('Videos Compressed', '2.4 GB');
        alert('Videos compressed successfully!\nSpace saved: 2.4 GB (simulation)');
    });

    // Initialize
    renderAnalyzer();
    renderDuplicates();
    renderHistory();
});
