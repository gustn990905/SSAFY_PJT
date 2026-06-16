let mealRecords = JSON.parse(localStorage.getItem('mealRecords')) || [];
let filteredMealRecords = [...mealRecords];

document.addEventListener('DOMContentLoaded', () => {
    renderMealList(filteredMealRecords);

    const btnFetchAll = document.getElementById('btnFetchAll');
    const btnUpdateMeal = document.getElementById('btnUpdateMeal');
    const btnDeleteMeal = document.getElementById('btnDeleteMeal');
    const btnSearchByMealId = document.getElementById('btnSearchByMealId');
    const btnSearchByUserId = document.getElementById('btnSearchByUserId');
    const searchMealId = document.getElementById('searchMealId');
    const searchUserId = document.getElementById('searchUserId');

    if (btnFetchAll) btnFetchAll.addEventListener('click', showAllMeals);
    if (btnUpdateMeal) btnUpdateMeal.addEventListener('click', updateMeal);
    if (btnDeleteMeal) btnDeleteMeal.addEventListener('click', deleteMeal);
    if (btnSearchByMealId) btnSearchByMealId.addEventListener('click', searchMealById);
    if (btnSearchByUserId) btnSearchByUserId.addEventListener('click', searchMealsByUserId);

    if (searchMealId) {
        searchMealId.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchMealById();
            }
        });
    }

    if (searchUserId) {
        searchUserId.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchMealsByUserId();
            }
        });
    }
});

function searchMealById() {
    const input = document.getElementById('searchMealId');
    if (!input) return;

    const mealId = input.value.trim();

    if (!mealId) {
        alert('식단 ID를 입력하세요.');
        return;
    }

    filteredMealRecords = mealRecords.filter(record => String(record.id) === mealId);
    renderMealList(filteredMealRecords);
}

function searchMealsByUserId() {
    const input = document.getElementById('searchUserId');
    if (!input) return;

    const userId = input.value.trim().toLowerCase();

    if (!userId) {
        alert('사용자 ID를 입력하세요.');
        return;
    }

    filteredMealRecords = mealRecords.filter(record =>
        record.userId && record.userId.toLowerCase() === userId
    );

    renderMealList(filteredMealRecords);
}

function showAllMeals() {
    mealRecords = JSON.parse(localStorage.getItem('mealRecords')) || [];
    filteredMealRecords = [...mealRecords];
    renderMealList(filteredMealRecords);
}

function renderMealList(records) {
    const body = document.getElementById('mealTableBody');
    const countText = document.getElementById('listCountText');

    if (!body) return;
    if (countText) countText.textContent = `총 ${records.length}건`;

    if (records.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    조회된 식단 기록이 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    body.innerHTML = records.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.userId || '-'}</td>
            <td>${record.date}</td>
            <td>${record.type}</td>
            <td class="text-truncate" style="max-width: 180px;">
                ${record.foods?.[0]?.name || '-'}${record.foods.length > 1 ? ` 외 ${record.foods.length - 1}개` : ''}
            </td>
            <td>${record.totalKcal.toFixed(1)} kcal</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="showDetail(${record.id})">보기</button>
            </td>
        </tr>
    `).join('');
}

window.showDetail = function(id) {
    const meal = mealRecords.find(record => record.id === id);
    if (!meal) return;

    const editMealId = document.getElementById('editMealId');
    const editUserId = document.getElementById('editUserId');
    const editDate = document.getElementById('editDate');
    const editType = document.getElementById('editType');
    const editFoodListArea = document.getElementById('editFoodListArea');
    const modalEl = document.getElementById('mealDetailModal');

    if (!editMealId || !editDate || !editType || !editFoodListArea || !modalEl) return;

    editMealId.value = meal.id;
    if (editUserId) editUserId.value = meal.userId || '';
    editDate.value = meal.date;
    editType.value = meal.type;

    editFoodListArea.innerHTML = `
        <h6 class="mb-2">등록 음식</h6>
        <ul class="list-group">
            ${meal.foods.map(food => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${food.name}</span>
                    <span class="text-muted">${food.kcal.toFixed(1)} kcal</span>
                </li>
            `).join('')}
        </ul>
    `;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
};

function updateMeal() {
    const editMealId = document.getElementById('editMealId');
    const editUserId = document.getElementById('editUserId');
    const editDate = document.getElementById('editDate');
    const editType = document.getElementById('editType');

    if (!editMealId || !editDate || !editType) return;

    const id = Number(editMealId.value);
    const meal = mealRecords.find(record => record.id === id);

    if (!meal) return;

    if (editUserId) meal.userId = editUserId.value.trim();
    meal.date = editDate.value;
    meal.type = editType.value;

    localStorage.setItem('mealRecords', JSON.stringify(mealRecords));
    filteredMealRecords = [...mealRecords];
    renderMealList(filteredMealRecords);

    const modalEl = document.getElementById('mealDetailModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    alert('수정되었습니다.');
}

function deleteMeal() {
    const editMealId = document.getElementById('editMealId');
    if (!editMealId) return;

    const id = Number(editMealId.value);

    if (!confirm('삭제할까요?')) return;

    mealRecords = mealRecords.filter(record => record.id !== id);
    localStorage.setItem('mealRecords', JSON.stringify(mealRecords));
    filteredMealRecords = [...mealRecords];
    renderMealList(filteredMealRecords);

    const modalEl = document.getElementById('mealDetailModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    alert('삭제되었습니다.');
}