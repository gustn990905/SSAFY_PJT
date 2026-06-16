let foodDatabase = [];
let selectedFoods = [];
let currentSearchResults = [];

document.addEventListener('DOMContentLoaded', () => {
    loadFoodDatabase();

    document.getElementById('btnSearch').addEventListener('click', searchFood);
    document.getElementById('mealForm').addEventListener('submit', saveMeal);

    document.getElementById('foodSearch').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchFood();
        }
    });

    document.getElementById('mealDate').value = new Date().toISOString().substring(0, 10);

    renderSelectedFoods();
    resetNutritionAnalysis();
    resetSearchResults();
});

async function loadFoodDatabase() {
    const analysisBox = document.getElementById('nutritionAnalysis');

    try {
        const response = await fetch('diet/food.csv');
        if (!response.ok) {
            throw new Error('diet/food.csv 파일을 찾을 수 없습니다.');
        }

        const data = await response.text();
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

        foodDatabase = lines
            .slice(1)
            .map(line => {
                const v = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (v.length < 23) return null;

                return {
                    name: cleanCsvValue(v[1]),
                    kcal: parseNumber(v[17]),
                    protein: parseNumber(v[19]),
                    fat: parseNumber(v[20]),
                    carbs: parseNumber(v[22])
                };
            })
            .filter(item => item && item.name);

        analysisBox.innerHTML = `
            <strong>영양 분석 요약:</strong> 음식 데이터 ${foodDatabase.length}개를 불러왔습니다.
        `;
    } catch (e) {
        console.error(e);
        analysisBox.innerHTML = `<span class="text-danger">❌ 에러: ${e.message}</span>`;
    }
}

function cleanCsvValue(value) {
    return (value || '').replace(/"/g, '').trim();
}

function parseNumber(value) {
    const cleaned = cleanCsvValue(value);
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

function searchFood() {
    const input = document.getElementById('foodSearch');
    const keyword = input.value.trim();

    if (!keyword) {
        alert('검색어를 입력하세요.');
        return;
    }

    if (foodDatabase.length === 0) {
        alert('음식 데이터가 아직 로드되지 않았습니다.');
        return;
    }

    const lowerKeyword = keyword.toLowerCase();

    currentSearchResults = foodDatabase.filter(food =>
        food.name && food.name.toLowerCase().includes(lowerKeyword)
    );

    renderSearchResults(keyword);
}

function renderSearchResults(keyword) {
    const resultList = document.getElementById('searchResultList');

    if (currentSearchResults.length === 0) {
        resultList.innerHTML = `
            <li class="list-group-item text-muted">
                "${keyword}" 를 포함한 검색 결과가 없습니다.
            </li>
        `;
        return;
    }

    resultList.innerHTML = currentSearchResults.map((food, idx) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${food.name} (${food.kcal.toFixed(1)} kcal)</span>
            <button type="button" class="btn btn-sm btn-outline-success" onclick="addFoodFromSearch(${idx})">추가</button>
        </li>
    `).join('');
}

function resetSearchResults() {
    document.getElementById('searchResultList').innerHTML = `
        <li class="list-group-item text-muted">
            검색어를 입력하고 검색 버튼을 누르세요.
        </li>
    `;
    currentSearchResults = [];
}

window.addFoodFromSearch = function(index) {
    const food = currentSearchResults[index];
    if (!food) return;

    selectedFoods.push(food);
    renderSelectedFoods();
    calculateNutrition();
};

function renderSelectedFoods() {
    const listEl = document.getElementById('selectedFoodList');

    if (selectedFoods.length === 0) {
        listEl.innerHTML = `
            <li class="list-group-item text-muted">
                검색 버튼을 눌러 음식을 추가하세요.
            </li>
        `;
        return;
    }

    listEl.innerHTML = selectedFoods.map((food, idx) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${food.name} (${food.kcal.toFixed(1)} kcal)</span>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFood(${idx})">삭제</button>
        </li>
    `).join('');
}

function calculateNutrition() {
    const total = selectedFoods.reduce((acc, cur) => {
        acc.kcal += cur.kcal;
        acc.carbs += cur.carbs;
        acc.protein += cur.protein;
        acc.fat += cur.fat;
        return acc;
    }, { kcal: 0, carbs: 0, protein: 0, fat: 0 });

    document.getElementById('nutritionAnalysis').innerHTML = `
        <strong>영양 분석 요약:</strong><br>
        총 ${total.kcal.toFixed(1)} kcal<br>
        탄수화물: ${total.carbs.toFixed(1)}g |
        단백질: ${total.protein.toFixed(1)}g |
        지방: ${total.fat.toFixed(1)}g
    `;
}

function resetNutritionAnalysis() {
    document.getElementById('nutritionAnalysis').innerHTML = `
        <strong>영양 분석 요약:</strong> 아직 등록된 음식이 없습니다.
    `;
}

window.removeFood = function(index) {
    selectedFoods.splice(index, 1);
    renderSelectedFoods();

    if (selectedFoods.length === 0) {
        resetNutritionAnalysis();
    } else {
        calculateNutrition();
    }
};

function saveMeal(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value.trim();
    const date = document.getElementById('mealDate').value;
    const type = document.getElementById('mealType').value;

    if (!userId) {
        alert('사용자 ID를 입력하세요.');
        return;
    }

    if (!date) {
        alert('날짜를 선택하세요.');
        return;
    }

    if (selectedFoods.length === 0) {
        alert('음식을 하나 이상 추가하세요.');
        return;
    }

    const mealRecords = JSON.parse(localStorage.getItem('mealRecords')) || [];

    const newMeal = {
        id: Date.now(),
        userId,
        date,
        type,
        foods: [...selectedFoods],
        totalKcal: selectedFoods.reduce((sum, food) => sum + food.kcal, 0)
    };

    mealRecords.unshift(newMeal);
    localStorage.setItem('mealRecords', JSON.stringify(mealRecords));

    alert('식단이 저장되었습니다.');
    window.location.href = 'diet.html';
}