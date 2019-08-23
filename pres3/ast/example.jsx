var React = require("react");
var Icon = require("./components/Icon")

var ActionIcon = React.createClass({
    //mixins: [],
    render() {
        var disabled = this.props.disabled;
        var iconClass = disabled ? "disabled" : "";
        var clickHandler = !disabled && this.props.onClick;

        return (
            <a
                onMouseEnter={() => this._toggleRowActive(true)}
                onMouseLeave={() => this._toggleRowActive(false)}
            >
                <Icon className={iconClass} icon={this.props.icon} onClick={clickHandler} />
            </a>
        );
    },

    _toggleRowActive(active) {
        this.props.toggleActive(active);
    }
});

ActionIcon.propTypes = {
    disabled: React.PropTypes.bool
}

module.exports = ActionIcon;
