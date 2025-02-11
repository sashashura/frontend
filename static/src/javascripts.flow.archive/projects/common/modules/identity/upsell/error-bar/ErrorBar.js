/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/common/modules/identity/upsell/error-bar/ErrorBar.js
 * to .ts, then delete it.
 */

// @flow
import React, { Component } from 'preact/compat';

type ErrorBarProps = {
    errors: string[],
    tagName: ?string,
};

export const genericErrorStr = 'Oops! Something went wrong';

export class ErrorBar extends Component<ErrorBarProps> {
    static defaultProps = {
        tagName: 'div',
    };

    render() {
        const { errors } = this.props;
        const TagName = this.props.tagName;
        return (
            <TagName aria-live="polite">
                {errors.map(error => (
                    <div className="form__error" role="alert">
                        {error}
                    </div>
                ))}
            </TagName>
        );
    }
}
