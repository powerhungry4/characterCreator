//WIP	Goal is to take an array of objects composed of keys equal to the types of dice and values 
//		equal to the number of dice of each type and return an object where each die rolled is a key
//		with each value being the appropriate die result 
//		example: [{10:2}, {6:2}] might become {{10:2}, {10:7}, {6:4}, {6:1}} 
//function bigDiceRoller({typeOfDice:numberOfDice}) {
//	var obj = {};
//	for(i = 0; i < arguments.length; i++) {
//		var dieType = null;
//		var dice = null;
//		obj.push(diceRoller(dieType, dice));
//	}
//	return obj;
//}

//diceRoller takes a single int typeOfDie and rolls an int numberOfDice equal to that type, 
//	then outputs the dice values into an array.
//summerBoolean is an optional parameter that, given any nonzero value, makes the function 
//	return an integer value equal to the sum of the array values in lieu of the array itself
function diceRoller(typeOfDie, numberOfDice, summerBoolean) {
	var arr = [];
	if (numberOfDice === undefined) {
		numberOfDice = 1;
	}
	for(i = 0; i < numberOfDice; i++) {
		arr.push(dieRoll(typeOfDie));
	}
	if (summerBoolean === undefined || summerBoolean === 0 || summerBoolean === false) {
			return arr;
	}
	else {
		return arr.reduce((total, current) => {
			return total += current;
		}, 0)
	}
}
//abilityScorer takes advantage of other helper functions to generate an array of 
//	6 values with these rules:
//	1. There will always be at least one 18.
//	2. The other 5 values in the array will result from rolling a minimum of 
//		4 6-sided dice per array value.
//	3. If any of those 4 dice are a 1, that die gets rerolled until its value is not a 1.
//	4. The smallest of those 4 resulting dice is removed.
//	5. Once we have the three higher non-one dice, they are added together and placed as a 
//		value in the array.
//	6. Continue until we have 6 values in the array.
//The result is 6 values including one guaranteed 18 and 5 numbers between 6-18 with an 
//	average value of 12.
function abilityScorer() {
	var arr = [18];
	while (arr.length < 6) {
		let tempArray = diceRoller(6, 4);
		tempArray = replaceOnes(tempArray, 6);
		removeSmallest(tempArray);
		arr = arr.concat(tempArray.reduce((total, current) => {return total+=current;}, 0));
	}
	return arr;
}
//removeSmallest takes an array, switches
function removeSmallest(arr) {
	for(i = 0; i < arr.length; i++) {
		if( arr[i] < arr[arr.length]) {
			let int = arr[arr.length];
			arr[arr.length] = arr[i];
			arr[i] = int;
		}
	}
	return arr.pop(arr);
}

function replaceOnes(arr, typeOfDice) {
	var length = arr.length;
	arr = filterOnes(arr);
	if (typeOfDice === undefined || typeOfDice === 0 || typeOfDice === false) {
		typeOfDice = 6;
	}
	while (arr.length < length) {
		arr.push(dieRoll(typeOfDice))
		arr = filterOnes(arr);
	}
	return arr;
}

function filterOnes (arr) {
	return arr.filter((el) => {
		return el > 1;
	});
}

function dieRoll(die) {
	if (die === undefined) {
		die = 6;
	}
	return Math.ceil(Math.random() * die);
}

function calculateAbilityModifier(abilityScore) {
	return Math.floor((abilityScore - 10) / 2);
}

function calculateAbility(baseValue, raceMod) {
	return (baseValue + raceMod);
}

// size: 0 = fine, 1 = diminuitive, 2 = tiny, 3 = small, 4 = medium, 
//	5 = large, 6 = huge, 7 = gargantuan, 8 = colossal;
//weaponSizing is used to change weapon damage dies based on 
//	the size of the creature its made for
//(see (http://www.d20srd.org/srd/equipment/weapons.htm) 
//	Table: Larger and Smaller Weapon Damage for more details)
function weaponSizing(mediumDamageDie, size) {
	if (size === 4) {
		return mediumDamageDie;
	}
	//if function is not redundant and weapon is weird like falchion or greatsword, 
	//	fix it for later calculations
	if (mediumDamageDie === 24 || mediumDamageDie === 26) {
		mediumDamageDie = (mediumDamageDie - 20) * 2;
	}
	//check if we are sizing down the weapon
	if (size < 4) {
		let iter = 4 - size;
		if (mediumDamageDie === 24 || mediumDamageDie === 26) {
			mediumDamageDie = (mediumDamageDie - 20) * 2;
		}
		while (iter > 0 && mediumDamageDie > 4) {
			mediumDamageDie -= 2;
			iter--;
		}
		return mediumDamageDie - iter;
	}
	//check if we are sizing up the weapon 
	//	(redundant, used for clarity more than anything, may be deleted later)
	if (size > 4) {
		let iter = size - 4;
		//medium weapons that start at d10 obey different rules than other weapons at higher 
		//	sizes so they are done seperately
		if (mediumDamageDie === 10) {
			mediumDamageDie = 28;
			iter--;
			while (iter > 0 && mediumDamageDie < 48) {
				mediumDamageDie += 10;
				iter--;
			}
			while (iter > 0 && mediumDamageDie >= 48) {
				mediumDamageDie += 20;
				iter--;
			}
			return mediumDamageDie;	
		}
		while (iter > 0 && mediumDamageDie < 4) {
			mediumDamageDie += 1;
			iter--;
		}
		while (iter > 0 && mediumDamageDie < 8) {
			mediumDamageDie += 2;
			iter--;
		}
		if (iter > 0 && mediumDamageDie === 8) {
			mediumDamageDie = 26;
			iter--;
		}
		if (iter > 0 && mediumDamageDie === 12) {
			mediumDamageDie = 36;
			iter--;
		}
		while (iter > 0 && mediumDamageDie < 46) {
			mediumDamageDie += 10;
			iter--;
		}
		while (iter > 0 && mediumDamageDie >= 46) {
			mediumDamageDie += 20;
			iter--;
		}
		return mediumDamageDie;
	}
}

function diceBreaker(numberDType) {
	if (numberDType == 1)
	{
		return [1, 1];
	}
	if (typeof numberDType != 'string') {
		return undefined;
	} 
	let split = numberDType.search('d');
	return [Number(numberDType.slice(0, split)), Number(numberDType.slice((split + 1), numberDType.length))]
}

function diceBuilder(numberOfDice, typeOfDice) {
	if (typeOfDice === undefined)
	{
		typeOfDice = 6;
	}
	if (numberOfDice === undefined)
	{
		numberOfDice = 1;
	}
	let str = numberOfDice.toString();
	return str.concat('d' + typeOfDice.toString());
}

module.exports.default = 
{
	diceRoller,
	abilityScorer,
	removeSmallest,
	replaceOnes,
	filterOnes,
	dieRoll,
	calculateAbility,
	weaponSizing,
	diceBreaker,
	diceBuilder,
	calculateAbilityModifier
}
