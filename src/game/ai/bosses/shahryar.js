export const shahryarAI = (context) => {
    const { read, act } = context;
    const count = read.actionCount;

    if (count % 2 === 0) {
        // Even: AOE Slash (1004)
        return act()
            .skill(1004)
            .targetAll()
            .build();
    } else {
        // Odd: Single Slash (1003)
        const target = read.getRandomTarget();
        return act()
            .skill(1003)
            .targetSingle(target)
            .build();
    }
};
