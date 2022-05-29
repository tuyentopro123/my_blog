const GetTime = (time) => {
    const date = time ? new Date(time).getTime(): 5
    const currentDate = new Date().getTime()
    const distance = currentDate - date;
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;

    const Years = Math.floor(distance / year)
    const Months = Math.floor((distance % year) / month)
    const Days = Math.floor((distance % month) / day)
    const Hours = Math.floor((distance % day) / hour)
    const Minutes = Math.floor((distance % hour) / minute) 
    const Seconds = Math.floor((distance % minute) / second)

    return Years > 0 ? Years + " năm trước"
    : Months > 0 ? Months + " tháng trước" 
    : Days > 0 ? Days + " ngày trước" 
    : Hours > 0 ? Hours + " giờ trước" 
    : Minutes > 0 ? Minutes + " phút trước" 
    : Seconds < 40 ? "Vừa xong" : Seconds +  " giây trước";
};

export default GetTime