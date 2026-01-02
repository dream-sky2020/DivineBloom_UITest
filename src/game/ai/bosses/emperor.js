export const emperorAI = (context) => {
    const { read, act } = context;
    const count = read.actionCount;

    if (count % 2 !== 0) {
        // Odd: Single Lightning (1001)
        const target = read.getRandomTarget();
        return act()
            .skill(1001)
            .targetSingle(target)
            .build();
    } else {
        // Even: AOE Blizzard (1002)
        return act()
            .skill(1002)
            .targetAll()
            .build();
    }
};
