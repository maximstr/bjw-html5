/**
 * Bjw game logic
 * @class
 * @param {int} [cols] column count of game field
 * @param {int} [rows] row count of game field
 * @param {Array} [gemTypes] list of gem types
 */
function Bjw(cols, rows, gemTypes) {
	this.cols = cols;
	this.rows = rows;
	this.gemTypes = gemTypes;
	/**
	 * List of indexes for vertical and horizontal pass order
	 * @type {Array}
	 * @desc
	 * Horizontal check order indexes for gemList 3x3
	 * 0 1 2
	 * 3 4 5
	 * 6 7 8
	 * Vertical check  order indexes for gemList 3x3
	 * 0 3 6
	 * 1 4 7
	 * 2 5 8
	 */
	this.verticalIndexOrder = [];
	var i, l = this.cols * this.rows;
	for ( i = 0; i < l; i++) {
		this.verticalIndexOrder[i] = ~~(i / this.rows) + (i % this.rows) * this.cols;
	}
}

/**
 * New game field generration
 * Gem index = [row * this.cols + col]
 * @return {Gem[]}
 */
Bjw.prototype.generateNewField = function(tryCount) {
	var i, l = this.cols * this.rows, gemList;
	var stepCount = 0;

	if (this.cols < 3 && this.rows < 3) {
		throw new Error('Too small playground');
	}

	do {
		if (tryCount && stepCount >= tryCount) {
			throw new Error('Insuffiecient try count: [' + this.cols + ' x ' + this.rows + '] types = ' + this.gemTypes.length);
		}
		stepCount++;
		gemList = [];
		for ( i = 0; i < l; i++) {
			gemList.push(this.getRandomNewGem());
		}
	} while (this.getWinCombinations(gemList, true).length > 0 || !this.isThereAnyMove(gemList));
	console.log("generated new gem list in steps: " + stepCount);
	// return stepCount;
	return gemList;
};
/**
 * Generate new Gem object with random type from this.gemTypes
 * @return {Gem}
 */
Bjw.prototype.getRandomNewGem = function() {
	return {
		type : this.gemTypes[~~(this.gemTypes.length * Math.random())]
	};
};
/**
 * Return true if user has any correct move
 * @return {boolean}
 */
Bjw.prototype.isThereAnyMove = function(gemList) {
	var l = gemList.length, i, gems = gemList.slice();

	// check original map
	if (this.getWinCombinations(gems, true).length > 0) {
		return true;
	}

	// check horizontal combinations
	if (this.cols > 1) {
		for ( i = 0; i < l - 1; i++) {
			// skip last column
			if ((i + 1) % this.cols === 0) {
				i += 1;
			}
			this.swapGems(gems, i, i + 1);
			if (this.getWinCombinations(gems, true).length > 0) {
				return true;
			} else {
				// restore original gem list
				this.swapGems(gems, i, i + 1);
			}
		}
	}
	// check vertical combinations
	if (this.rows > 1) {
		var vIndexes = this.verticalIndexOrder, gemIndex, nextGemIndex;
		for ( i = 0; i < l - 1; i++) {
			// skip last row
			if ((i + 1) % this.rows === 0) {
				i += 1;
			}
			gemIndex = vIndexes[i];
			nextGemIndex = vIndexes[i + 1];
			this.swapGems(gems, gemIndex, nextGemIndex);
			if (this.getWinCombinations(gems, true).length > 0) {
				return true;
			} else {
				// restore original gem list
				this.swapGems(gems, gemIndex, nextGemIndex);
			}
		}
	}
	return false;
};
Bjw.prototype.swapGems = function(gemList, fromIndex, toIndex) {
	var fromGem = gemList[fromIndex];
	gemList[fromIndex] = gemList[toIndex];
	gemList[toIndex] = fromGem;
};
/**
 * Returns array of win combinations
 * @param {Gem[]} [gemList]
 * @param {boolean} [firstOnly] if true returns only first win combination (performance)
 * @return {Array[]} Array of Array of gem-index Example: [[0, 1, 2], [0, 3, 6]]
 */
Bjw.prototype.getWinCombinations = function(gemList, firstOnly) {
	var l = gemList.length, lastGemType = -1, gemType, i, combination = [], winCombinations = [];

	// check horizontal combinations
	for ( i = 0; i < l; i++) {
		gemType = gemList[i].type;
		if (gemType === lastGemType) {
			combination.push(i);
		} else {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [i];
		}
		// end of row
		if ((i + 1) % this.cols === 0) {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [];
			lastGemType = -1;
		} else {
			lastGemType = gemType;
		}
		if (firstOnly && winCombinations.length > 0) {
			return winCombinations;
		}
	}
	// check vertical combinations
	var vIndexes = this.verticalIndexOrder, gemIndex;
	for ( i = 0; i < l; i++) {
		gemIndex = vIndexes[i];
		gemType = gemList[gemIndex].type;
		if (gemType === lastGemType) {
			combination.push(gemIndex);
		} else {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [gemIndex];
		}
		// end of col
		if ((i + 1) % this.rows === 0) {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [];
			lastGemType = -1;
		} else {
			lastGemType = gemType;
		}
		if (firstOnly && winCombinations.length > 0) {
			return winCombinations;
		}
	}
	return winCombinations;
};
Bjw.prototype.indexToPosition = function(index) {
	return {
		col : index % this.cols,
		row : ~~(index / this.cols)
	};
};
Bjw.prototype.positionToIndex = function(col, row) {
	return col + this.cols * row;
};
/**
 * Swap specified gems and return new gem list
 * @param {gemList[]} [gemList]
 * @param {int} [fromPos]
 * @param {int} [toPos]
 * @return {action:remove/move/add, gems[{c,r}]}
 */
Bjw.prototype.getGemSwapingActions = function(gemList, from, to) {
	var gems = gemList.slice(), actions = [], winCombinations = [];

	this.swapGems(gems, from, to);

	do {
		winCombinations = this.getWinCombinations(gems, false);
		actions.push({
			action : 'remove',
			gems : winCombinations
		});
	} while (winCombinations.length);

	// check horizontal combinations
	for ( i = 0; i < l; i++) {
		gemType = gemList[i].type;
		if (gemType === lastGemType) {
			combination.push(i);
		} else {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [i];
		}
		// end of row
		if ((i + 1) % this.cols === 0) {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [];
			lastGemType = -1;
		} else {
			lastGemType = gemType;
		}
		if (firstOnly && winCombinations.length > 0) {
			return winCombinations;
		}
	}
	// check vertical combinations
	var vIndexes = this.verticalIndexOrder, gemIndex;
	for ( i = 0; i < l; i++) {
		gemIndex = vIndexes[i];
		gemType = gemList[gemIndex].type;
		if (gemType === lastGemType) {
			combination.push(gemIndex);
		} else {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [gemIndex];
		}
		// end of col
		if ((i + 1) % this.rows === 0) {
			if (combination.length >= 3) {
				winCombinations.push(combination);
			}
			combination = [];
			lastGemType = -1;
		} else {
			lastGemType = gemType;
		}
		if (firstOnly && winCombinations.length > 0) {
			return winCombinations;
		}
	}
	return winCombinations;
};

/*
 * Prepare class for using by browser and node.js
 */
if ( typeof module === "object" && typeof module.exports === "object") {
	module.exports = Bjw;
} else {
	if ( typeof define === "function" && define.amd) {
		define([], function() {
			return Bjw;
		});
	}
}
if ( typeof window === "object" && typeof window.document === "object") {
	window.Bjw = Bjw;
}