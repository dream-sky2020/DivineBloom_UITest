export const hefietianAI = (context) => {
    const { read, act } = context;
    const count = read.actionCount;

    if (count % 2 === 0) {
        // Even: AOE Fire (1006)
        return act()
            .skill(1006)
            .targetAll()
            .build();
    } else {
        // Odd: Single Fire (1005)
        const target = read.getRandomTarget();
        return act()
            .skill(1005)
            .targetSingle(target)
            .build();
    }
};
