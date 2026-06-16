let mealRecords = JSON.parse(localStorage.getItem('mealRecords')) || [];
let filteredMealRecords = [...mealRecords];

document.addEventListener('DOMContentLoaded', () => {
    renderMealList(filteredMealRecords);

    document.getElementById('btnFetchAll').addEventListener('click', showAllMeals);
    document.getElementById('btnUpdateMeal').addEventListener('click', updateMeal);
    document.getElementById('btnDeleteMeal').addEventListener('click', deleteMeal);
    document.getElementById('btnSearchByMealId').addEventListener('click', searchMealById);
    document.getElementById('btnSearchByUserId').addEventListener('click', searchMealsByUserId);

    document.getElementById('searchMealId').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchMealById();
        }
    });

    document.getElementById('searchUserId').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchMealsByUserId();
        }
    });
});

function searchMealById() {
    const mealId = document.getElementById('searchMealId').value.trim();

    if (!mealId) {
        alert('식단 ID를 입력하세요.');
        return;
    }

    filteredMealRecords = mealRecords.filter(record => String(record.id) === mealId);
    renderMealList(filteredMealRecords);
}

function searchMealsByUserId() {
    const userId = document.getElementById('searchUserId').value.trim().toLowerCase();

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

    countText.textContent = `총 ${records.length}건`;

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
            <td class="text-truncate text-truncate-cell">
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

    document.getElementById('editMealId').value = meal.id;
    document.getElementById('editUserId').value = meal.userId || '';
    document.getElementById('editDate').value = meal.date;
    document.getElementById('editType').value = meal.type;

    document.getElementById('editFoodListArea').innerHTML = `
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

    const modal = new bootstrap.Modal(document.getElementById('mealDetailModal'));
    modal.show();
};

function updateMeal() {
    const id = Number(document.getElementById('editMealId').value);
    const meal = mealRecords.find(record => record.id === id);

    if (!meal) return;

    meal.userId = document.getElementById('editUserId').value.trim();
    meal.date = document.getElementById('editDate').value;
    meal.type = document.getElementById('editType').value;

    localStorage.setItem('mealRecords', JSON.stringify(mealRecords));
    filteredMealRecords = [...mealRecords];
    renderMealList(filteredMealRecords);

    const modalEl = document.getElementById('mealDetailModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    alert('수정되었습니다.');
}

function deleteMeal() {
    const id = Number(document.getElementById('editMealId').value);

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