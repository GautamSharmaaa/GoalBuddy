let currentAmount = 0;
let countdownInterval;
let timeRemaining;
let isCountdownActive = false;
const goalData = [];
let chartInstance = null;

function updateGoalProgress() {
    const goalAmount = parseFloat(document.getElementById('goalAmount').value);
    const goalProgress = (currentAmount / goalAmount) * 100;

    document.getElementById('goalBar').style.width = `${Math.min(goalProgress, 100)}%`;
    document.getElementById('goalText').textContent = 
        `$${currentAmount.toFixed(2)} / $${goalAmount.toFixed(2)} (${goalProgress.toFixed(1)}%)`;
}

function adjustAmount(direction) {
    const adjustValue = 10 * direction; 
    currentAmount = Math.max(0, currentAmount + adjustValue);
    updateGoalProgress();
    updateGraph();
}

function startCountdown() {
    if (isCountdownActive) return;

    const timeGoal = parseInt(document.getElementById('timeGoal').value);
    if (timeGoal <= 0) return;

    currentAmount = 0;
    goalData.length = 0;
    updateGoalProgress();
    updateGraph();

    timeRemaining = timeGoal;
    isCountdownActive = true;
    document.getElementById('startButton').disabled = true;

    countdownInterval = setInterval(() => {
        timeRemaining--;
        const timeProgress = ((timeGoal - timeRemaining) / timeGoal) * 100;

        document.getElementById('timeBar').style.width = `${timeProgress}%`;
        document.getElementById('timeText').textContent = `${timeRemaining} seconds remaining`;

        goalData.push({ time: timeGoal - timeRemaining, amount: currentAmount });
        updateGraph();

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('timeText').textContent = "Time's up!";
            document.getElementById('startButton').disabled = false;
            isCountdownActive = false;
        }
    }, 1000);
}

function updateGraph() {
    const ctx = document.getElementById('timeGoalChart').getContext('2d');

    const timeLabels = goalData.map((point) => point.time);
    const amountData = goalData.map((point) => point.amount);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Goal Progress ($)',
                    data: amountData,
                    borderColor: '#00ff9d',
                    backgroundColor: 'rgba(0, 255, 157, 0.2)',
                    tension: 0.2,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('goalAmount').addEventListener('input', updateGoalProgress);
updateGoalProgress();
