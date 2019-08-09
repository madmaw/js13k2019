let countDown = (n: number, count: number) => {
    console.log(n);
    if(count > 0) {
        countDown(n+2, count - 1);
    }
}