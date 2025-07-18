import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [startTime, setStartTime] = useState<string>('09:00');
    const [leaveTime, setLeaveTime] = useState<string>('');
    const [remainingTime, setRemainingTime] = useState<string>('');

    // 퇴근 시간이 변경될 때마다 카운트다운을 설정하는 useEffect
    useEffect(() => {
        // leaveTime이 없으면 아무것도 하지 않음
        if (!leaveTime) {
            setRemainingTime('');
            return;
        }

        // 1초마다 남은 시간을 계산하는 인터벌 설정
        const intervalId = setInterval(() => {
            const now = new Date();
            const leaveDate = new Date();
            const [hours, minutes] = leaveTime.split(':').map(Number);
            leaveDate.setHours(hours, minutes, 0, 0);

            // 만약 계산된 퇴근 시간이 현재 시간보다 이르다면, 다음 날로 간주
            if (leaveDate < now) {
                leaveDate.setDate(leaveDate.getDate() + 1);
            }

            const diff = leaveDate.getTime() - now.getTime();

            // 남은 시간이 없다면
            if (diff <= 0) {
                setRemainingTime('🎉 퇴근 시간입니다! 🎉');
                clearInterval(intervalId); // 인터벌 정리
                return;
            }

            // 남은 시간을 시, 분, 초로 변환
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

            // 남은 시간 상태 업데이트
            setRemainingTime(
                `${String(hoursLeft).padStart(2, '0')}시간 ${String(minutesLeft).padStart(2, '0')}분 ${String(secondsLeft).padStart(2, '0')}초`
            );
        }, 1000);

        // 컴포넌트가 언마운트되거나 leaveTime이 변경될 때 인터벌을 정리
        return () => clearInterval(intervalId);
    }, [leaveTime]); // leaveTime이 변경될 때마다 이 effect를 다시 실행

    const handleCalculate = () => {
        if (startTime) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);

            // 9시간 근무 (점심시간 1시간 포함)
            const leaveDate = new Date(startDate.getTime() + 9 * 60 * 60 * 1000);

            const leaveHours = String(leaveDate.getHours()).padStart(2, '0');
            const leaveMinutes = String(leaveDate.getMinutes()).padStart(2, '0');

            setLeaveTime(`${leaveHours}:${leaveMinutes}`);
        }
    };

    return (
        <div className="container">
            <h1>퇴근 시간 계산기 🕰️</h1>
            <div className="input-group">
                <label htmlFor="startTime">출근 시간:</label>
                <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                />
            </div>
            <button onClick={handleCalculate}>계산하기</button>

            {leaveTime && (
                <div className="result">
                    <h2>예상 퇴근 시간: {leaveTime}</h2>
                    {/* 남은 시간 표시 */}
                    {remainingTime && <p className="countdown">{remainingTime}</p>}
                </div>
            )}
        </div>
    );
}

export default App;
