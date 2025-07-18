import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
    const [startTime, setStartTime] = useState<string>('09:00');
    const [leaveTime, setLeaveTime] = useState<string>('');
    const [remainingTime, setRemainingTime] = useState<string>('');

    // setInterval의 ID를 저장하기 위한 ref 생성
    // useRef는 리렌더링을 유발하지 않으면서 값을 유지할 수 있습니다.
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        // leaveTime이 없으면 아무것도 하지 않음
        if (!leaveTime) {
            setRemainingTime('');
            return;
        }

        // 1초마다 남은 시간을 계산하는 인터벌 설정
        intervalRef.current = window.setInterval(() => {
            const now = new Date();
            const leaveDate = new Date();
            const [hours, minutes] = leaveTime.split(':').map(Number);
            leaveDate.setHours(hours, minutes, 0, 0);

            if (leaveDate < now) {
                leaveDate.setDate(leaveDate.getDate() + 1);
            }

            const diff = leaveDate.getTime() - now.getTime();

            if (diff <= 0) {
                setRemainingTime('🎉 퇴근 시간입니다! 🎉');
                // 카운트다운이 끝나면 인터벌 정리
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                return;
            }

            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

            setRemainingTime(
                `${String(hoursLeft).padStart(2, '0')}시간 ${String(minutesLeft).padStart(2, '0')}분 ${String(secondsLeft).padStart(2, '0')}초`
            );
        }, 1000);

        // 컴포넌트가 언마운트되거나 leaveTime이 변경될 때 인터벌을 정리하는 cleanup 함수
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [leaveTime]);

    const handleCalculate = () => {
        // --- 핵심 수정 사항 ---
        // 새로운 계산을 시작하기 전에 기존에 실행 중이던 인터벌을 즉시 중지합니다.
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (startTime) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);

            const leaveDate = new Date(startDate.getTime() + 9 * 60 * 60 * 1000);

            const leaveHours = String(leaveDate.getHours()).padStart(2, '0');
            const leaveMinutes = String(leaveDate.getMinutes()).padStart(2, '0');

            // leaveTime 상태를 업데이트하면, 위의 useEffect가 다시 실행됩니다.
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
                    {remainingTime && <p className="countdown">{remainingTime}</p>}
                </div>
            )}
        </div>
    );
}

export default App;
