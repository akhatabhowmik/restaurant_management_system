const backend_api = "http://localhost:8000";
let reservationChart = null;
let incomeChart = null;

async function loadReservationChart() {
    const year = document.getElementById("year-select-reservation").value;
    const res_chart = document.getElementById("reservation-barChart");
    const res = await fetch(`${backend_api}/reservations/monthly_count?year=${year}`);
    const data = await res.json();
    if (reservationChart) {
        reservationChart.destroy();
    }

    const months = data.map(d => d.month);
    const counts = data.map(d => d.total_count);

    reservationChart = new Chart(res_chart, {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: `Reservations in ${year}`,
                data: counts, backgroundColor: "#e9ca2fff",
                borderColor: "#e9ca2fff", borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });


}

async function loadMonthlyIncomeChart() {
    const year = document.getElementById("year-select-income").value;
    const inc_chart = document.getElementById("monthly-income-doughnut");
    const res = await fetch(`${backend_api}/reservations/monthly_income?year=${year}`);
    const data = await res.json();
    if (incomeChart) {
        incomeChart.destroy()
    }

    const labels = data.map(d => d.month);
    const income = data.map(d => d.income);

    incomeChart = new Chart(inc_chart, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: `Income in ${year}`,
                data: income,
                backgroundColor: ['#FF6384', '#36A2EB',
                    '#FFCE56', '#4CAF50', '#9C27B0', '#9CCC65',
                    '#FF9800', '#607D8B', '#795548', '#2196F3',
                    '#9C27B0', '#E91E63', '#FF5722'],

            }]
        },
        options: {
            responsive: true,
        }
    });
}

document.getElementById("year-select-reservation").addEventListener("change", loadReservationChart);
document.getElementById("year-select-income").addEventListener("change", loadMonthlyIncomeChart);

document.addEventListener("DOMContentLoaded", loadReservationChart);
document.addEventListener("DOMContentLoaded", loadMonthlyIncomeChart);