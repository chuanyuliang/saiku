var SaikuOlapQueryTemplate = {
  "queryModel": {
    "axes": {
      "FILTER": {
        "mdx": null,
        "filters": [],
        "sortOrder": null,
        "sortEvaluationLiteral": null,
        "hierarchizeMode": null,
        "location": "FILTER",
        "hierarchies": [],
        "nonEmpty": false,
      },
      "COLUMNS": {
        "mdx": null,
        "filters": [],
        "sortOrder": null,
        "sortEvaluationLiteral": null,
        "hierarchizeMode": null,
        "location": "COLUMNS",
        "hierarchies": [],
        "nonEmpty": true,
      },
      "ROWS": {
        "mdx": null,
        "filters": [],
        "sortOrder": null,
        "sortEvaluationLiteral": null,
        "hierarchizeMode": null,
        "location": "ROWS",
        "hierarchies": [],
        "nonEmpty": true,
      }
    },
    "visualTotals": false,
    "visualTotalsPattern": null,
    "lowestLevelsOnly": false,
    "details": {
      "axis": "COLUMNS",
      "location": "BOTTOM",
      "measures": []
    },
    "calculatedMeasures": []
  }, 
  "queryType": "OLAP",
  "type": "QUERYMODEL"
};

var SaikuOlapQueryHelper = function(query) {
	this.query = query;
};


SaikuOlapQueryHelper.prototype.model = function() {
	return this.query.model;
};

SaikuOlapQueryHelper.prototype.getHierarchy = function(name) {
  for (var axisName in this.model().queryModel.axes) {
      var axis = this.model().queryModel.axes[axisName];
      var hierarchy = _.find(axis.hierarchies, function(he) { 
                  return he.name == name; 
              });
      if (hierarchy) {
        return hierarchy;
      }
    };
    return null;
};
SaikuOlapQueryHelper.prototype.includeLevel = function(axis, hierarchy, level) {
    var mHierarchy = this.getHierarchy(hierarchy);
    if (mHierarchy) {
      mHierarchy.levels[level] = { name: level };
    } else {
      if (axis) {
        var _axis = this.model().queryModel.axes[axis];
        if (_axis) {
              var h = { "name" : hierarchy, "levels": { }};
              h.levels[level] = { name: level };
              _axis.hierarchies.push(h);
        } else {
          Saiku.log("Cannot find axis: " + axis + " to include Level: " + level);
        }
      } else {
        Saiku.log("You need to provide an axis to include new hierarchy: " + hierarchy + " to include Level: " + level);
      }
    }
};

SaikuOlapQueryHelper.prototype.includeMeasure = function(measure) {
  this.model().queryModel.details.measures.push(measure);
};

SaikuOlapQueryHelper.prototype.swapAxes = function() {
  var axes = this.model().queryModel.axes;
  var tmpAxis = axes['ROWS'];
  tmpAxis.location = 'COLUMNS';
  axes['ROWS'] = axes['COLUMNS'];
  axes['ROWS'].location = 'ROWS';
  axes['COLUMNS'] = tmpAxis;
};

SaikuOlapQueryHelper.prototype.nonEmpty = function(nonEmpty) {
  if (nonEmpty) {
    this.model().queryModel.axes['ROWS'].nonEmpty = true;
    this.model().queryModel.axes['COLUMNS'].nonEmpty = true;
  } else {
    this.model().queryModel.axes['ROWS'].nonEmpty = false;
    this.model().queryModel.axes['COLUMNS'].nonEmpty = false;
  }

}




