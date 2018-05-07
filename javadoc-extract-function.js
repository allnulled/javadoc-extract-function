function extractJavadocData(fileContents) {
	var REGEX_JAVADOC = /\/\*\*[^\n]*\n([\t ]*\*[\t ]*[^\n]*\n)+[\t ]*\*\//g;
	var REGEX_BEGINING_AND_ENDING = /^\/\*\*[\t ]*\n|\n[\t ]*\*+\/$/g;
	var REGEX_JAVADOC_LINE_BEGINING = /\n[\t ]*\*[\t ]*/g;
	var REGEX_JAVADOC_LINE_BEGINING_ATTRIBUTE = /^\@[a-zA-Z0-9\-\_\$]*/g;
	var REGEX_SPACES_EXTREMES = /^[\t\n ]*|[\t\n ]*$/g;
	var javadocComments = contents.match(REGEX_JAVADOC);
	var javadocFileData = [];
	function appendToLast(obj, prop, item, isNew = false) {
		if(!obj[prop]) {
			obj[prop] = [];
		}
		if(isNew || (obj[prop].length === 0)) {
			obj[prop].push("");
		}
		obj[prop][obj[prop].length-1] += item;
	};
	javadocComments.forEach(function(javadocComment) {
		var javadocCommentClean = "\n" + javadocComment.replace(REGEX_BEGINING_AND_ENDING, "");
		var javadocLines = javadocCommentClean.split(REGEX_JAVADOC_LINE_BEGINING);
		var javadocCommentData = {default:[]};
		var currentAttribute = "default";
		javadocLines.forEach(function(javadocLine) {
			var attributeMatch = javadocLine.match(REGEX_JAVADOC_LINE_BEGINING_ATTRIBUTE);
			if(attributeMatch) {
				currentAttribute = attributeMatch[0];
				appendToLast(javadocCommentData, currentAttribute, javadocLine.replace(REGEX_JAVADOC_LINE_BEGINING_ATTRIBUTE, "").trim().replace(REGEX_SPACES_EXTREMES, ""), true);
			} else if(javadocLine === "") {
				appendToLast(javadocCommentData, currentAttribute, "\n" + javadocLine.trim().replace(REGEX_SPACES_EXTREMES, ""));
			} else {
				appendToLast(javadocCommentData, currentAttribute, " " + javadocLine.trim().replace(REGEX_SPACES_EXTREMES, ""));
			}
		});
		javadocFileData.push(javadocCommentData);
	});
	return javadocFileData;
};
