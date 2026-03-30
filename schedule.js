function load(){

    day1.value=localStorage.getItem("day1")||""
    day2.value=localStorage.getItem("day2")||""
    day3.value=localStorage.getItem("day3")||""
    
    }
    
    function saveSchedule(){
    
    localStorage.setItem("day1",day1.value)
    localStorage.setItem("day2",day2.value)
    localStorage.setItem("day3",day3.value)
    
    alert("저장 완료")
    
    }
    
    load()