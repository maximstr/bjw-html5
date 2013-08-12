var Bjw = typeof window !== 'undefined' ? window.Bjw : require('../bjw');
describe("bjw creation", function() {

    var g, g1, g2, g3, g4, g5, g6, g7;

    function Gem(type) {
        return {
            type: type
        };
    }

    beforeEach(function() {
        g = new Gem(0);
        g1 = new Gem(1);
        g2 = new Gem(2);
        g3 = new Gem(3);
        g4 = new Gem(4);
        g5 = new Gem(5);
        g6 = new Gem(6);
        g7 = new Gem(7);
        g8 = new Gem(8);
        g9 = new Gem(9);
    });

    it("should calculate win combinations of NxN gem matrix", function() {

        var bjw, gemList;
        bjw = new Bjw(3, 3, [0, 1]);
        gemList = [
        g, g, g,
        g, g, g,
        g, g, g];
        expect(bjw.getWinCombinations(gemList).length).toBe(6);

        bjw = new Bjw(3, 3, [0, 1]);
        gemList = [
        g1, g1, g1,
        g2, g2, g3,
        g3, g2, g2];
        expect(bjw.getWinCombinations(gemList)[0].join()).toBe([0, 1, 2].join());

        bjw = new Bjw(5, 5, [0, 1, 2]);
        gemList = [
        g1, g, g1, g2, g2,
        g1, g1, g1, g1, g1,
        g1, g1, g1, g2, g,
        g1, g1, g2, g2, g2,
        g1, g1, g1, g2, g2];
        var trueWinCombinations = [
            [5, 6, 7, 8, 9],
            [10, 11, 12],
            [17, 18, 19],
            [20, 21, 22],
            [0, 5, 10, 15, 20],
            [6, 11, 16, 21],
            [2, 7, 12],
            [13, 18, 23]
        ];
        expect(bjw.getWinCombinations(gemList).join()).toBe(trueWinCombinations.join());
    });

    it("should calculate win combinations of NxM gem matrix", function() {
        var bjw, gemList, trueWinCombinations;

        bjw = new Bjw(4, 1, [0, 1, 2]);
        gemList = [
        g, g1, g1, g1];
        trueWinCombinations = [
            [1, 2, 3]
        ];
        expect(bjw.getWinCombinations(gemList).join()).toBe(trueWinCombinations.join());

        bjw = new Bjw(1, 5, [0, 1, 2]);
        gemList = [
        g,
        g1,
        g1,
        g1,
        g1];
        trueWinCombinations = [
            [1, 2, 3, 4]
        ];
        expect(bjw.getWinCombinations(gemList).join()).toBe(trueWinCombinations.join());

        bjw = new Bjw(5, 3, [0, 1, 2]);
        gemList = [
        g1, g, g1, g2, g2,
        g1, g1, g1, g1, g1,
        g1, g1, g1, g2, g];
        trueWinCombinations = [
            [5, 6, 7, 8, 9],
            [10, 11, 12],
            [0, 5, 10],
            [2, 7, 12]
        ];
        expect(bjw.getWinCombinations(gemList).join()).toBe(trueWinCombinations.join());

        bjw = new Bjw(3, 5, [0, 1, 2]);
        gemList = [
        g1, g, g1,
        g1, g1, g1,
        g1, g1, g1,
        g1, g1, g2,
        g1, g1, g1];
        trueWinCombinations = [
            [3, 4, 5],
            [6, 7, 8],
            [12, 13, 14],
            [0, 3, 6, 9, 12],
            [4, 7, 10, 13],
            [2, 5, 8]
        ];
        expect(bjw.getWinCombinations(gemList).join()).toBe(trueWinCombinations.join());
    });

    it("should determine lock states (there is no user moves)", function() {
        var bjw, gemList;

        bjw = new Bjw(4, 1, [0, 1, 2]);
        gemList = [
        g1, g, g1, g1];
        expect(bjw.isThereAnyMove(gemList)).toBe(true);

        bjw = new Bjw(4, 1, [0, 1, 2]);
        gemList = [
        g1, g1, g, g1];
        expect(bjw.isThereAnyMove(gemList)).toBe(true);

        bjw = new Bjw(4, 1, [0, 1, 2]);
        gemList = [
        g1, g, g, g1];
        expect(bjw.isThereAnyMove(gemList)).toBe(false);

        bjw = new Bjw(1, 5, [0, 1, 2]);
        gemList = [
        g,
        g1,
        g2,
        g1,
        g1];
        expect(bjw.isThereAnyMove(gemList)).toBe(true);

        bjw = new Bjw(1, 5, [0, 1, 2]);
        gemList = [
        g,
        g,
        g2,
        g,
        g1];
        expect(bjw.isThereAnyMove(gemList)).toBe(true);

        bjw = new Bjw(5, 3, [0, 1, 2]);
        gemList = [
        g1, g, g1, g2, g2,
        g, g1, g, g1, g1,
        g1, g1, g, g2, g];
        expect(bjw.isThereAnyMove(gemList)).toBe(true);

        bjw = new Bjw(5, 3, [0, 1, 2, 3]);
        gemList = [
        g1, g2, g3, g2, g,
        g2, g2, g3, g1, g3,
        g1, g, g, g1, g1];
        expect(bjw.isThereAnyMove(gemList)).toBe(false);
    });

    it("should generate gem matrix without win states and lock states", function() {
        var bjw, gemList, err;
        try {
            gemList = new Bjw(2, 2, [1]).generateNewField(1);
        }
        catch (r) {
            err = r.message;
        }
        expect(err).toBe('Too small playground');

        bjw = new Bjw(3, 3, [0, 1]);
        gemList = bjw.generateNewField(1000);
        expect(bjw.isThereAnyMove(gemList)).toBe(true);
        expect(bjw.getWinCombinations(gemList).length).toBe(0);

        bjw = new Bjw(4, 4, [0, 1, 2]);
        gemList = bjw.generateNewField(1000);
        expect(bjw.isThereAnyMove(gemList)).toBe(true);
        expect(bjw.getWinCombinations(gemList).length).toBe(0);

        bjw = new Bjw(5, 5, [0, 1, 2, 3]);
        gemList = bjw.generateNewField(1000);
        expect(bjw.isThereAnyMove(gemList)).toBe(true);
        expect(bjw.getWinCombinations(gemList).length).toBe(0);

        bjw = new Bjw(10, 10, [0, 1, 2, 3, 4]);
        gemList = bjw.generateNewField(2000);
        expect(bjw.isThereAnyMove(gemList)).toBe(true);
        expect(bjw.getWinCombinations(gemList).length).toBe(0);

        bjw = new Bjw(15, 15, [0, 1, 2, 3, 4, 5]);
        gemList = bjw.generateNewField(30000);
        expect(bjw.isThereAnyMove(gemList)).toBe(true);
        expect(bjw.getWinCombinations(gemList).length).toBe(0);
    });
});


xdescribe("bjw gameplay", function() {

        var bjw, gemList, actions;

        bjw = new Bjw(3, 3, [0, 1, 3]);
        gemList = [
        g1, g1, g,
        g, g2, g,
        g, g1, g1];
        actions = bjw.getGemSwapingActions(gemList, 0, 3);
        expect(JSON.stringify(actions)).toBe(JSON.stringify([]));
        
        bjw = new Bjw(3, 3, [0, 1, 3]);
        gemList = [
        g1, g1, g,
        g, g2, g1,
        g, g1, g1];
        actions = bjw.getGemSwapingActions(gemList, 1, 2);
        expect(JSON.stringify(actions[0])).toBe(JSON.stringify({action:'remove', gems:[0, 1, 2]}));
        expect(actions[1].action).toBe('add');
        expect(actions[1].gems.length).toBe(3);
        
        bjw = new Bjw(3, 3, [0, 1, 3]);
        gemList = [
        g1, g1, g,
        g, g2, g1,
        g, g1, g1];
        actions = bjw.getGemSwapingActions(gemList, 1, 2);
        expect(JSON.stringify(actions[0])).toBe(JSON.stringify({action:'remove', gems:[2, 5, 8]}));
        expect(actions[1].action).toBe('add');
        expect(actions[1].gems.length).toBe(3);
        
        
        
    /*
    select first gem
    select second gem
    if is not neighbor
        remove first selection
        select second gem as first
    if is neighbor gem
        swap them (animation)   -->     [swapGems(cr, cr):Array]
        check wincombinations
        if no
            restore prev state (animation)  -->     show animation only
        if yes
            lock gui
            remove all win combinations (animation)  -->    processGemSwaping(gems):Array of changes {action:remove/move/add, gems[{c,r}]}
            fall down gems from above (animation)
            fill the empty cells (animation)
            after animation unlock gui
    */



    it("should process gems removing", function() {
        // remove gems
        // return old and new positions for moving games
        // suggest new gems in new gaps
    });

});

describe("bjw traslation utils", function() {
    it('should translate index to position and vice versa', function() {

        var bjw;
        bjw = new Bjw(3, 3, [0, 1]);
        expect(JSON.stringify(bjw.indexToPosition(3))).toBe(JSON.stringify({
            col: 0,
            row: 1
        }));
        expect(JSON.stringify(bjw.indexToPosition(0))).toBe(JSON.stringify({
            col: 0,
            row: 0
        }));
        expect(JSON.stringify(bjw.indexToPosition(2))).toBe(JSON.stringify({
            col: 2,
            row: 0
        }));
        expect(JSON.stringify(bjw.indexToPosition(7))).toBe(JSON.stringify({
            col: 1,
            row: 2
        }));
        bjw = new Bjw(15, 7, [0, 1]);
        expect(JSON.stringify(bjw.indexToPosition(16))).toBe(JSON.stringify({
            col: 1,
            row: 1
        }));
        expect(JSON.stringify(bjw.indexToPosition(104))).toBe(JSON.stringify({
            col: 14,
            row: 6
        }));

        bjw = new Bjw(3, 3, [0, 1]);
        expect(bjw.positionToIndex(0, 0)).toBe(0);
        expect(bjw.positionToIndex(1, 1)).toBe(4);
        expect(bjw.positionToIndex(0, 2)).toBe(6);
        bjw = new Bjw(15, 3, [0, 1]);
        expect(bjw.positionToIndex(3, 1)).toBe(18);
        expect(bjw.positionToIndex(14, 2)).toBe(44);
        expect(bjw.positionToIndex(9, 0)).toBe(9);
    });

});