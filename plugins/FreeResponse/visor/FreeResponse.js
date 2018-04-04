import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import './../_freeResponse.scss';
import i18n from 'i18next';

/* eslint-disable react/prop-types */

export function FreeResponse() {
    return {
        getRenderTemplate: function(state, props) {
            let attempted = props.exercises && props.exercises.attempted;
            let score = (props.exercises.score || 0) + "/" + (props.exercises.weight || 0);
            return <div className={"exercisePlugin freeResponsePlugin " + (attempted ? " attempted" : "")} > {/* <h1>Free Response</h1>*/}
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer="Question"/>
                        <textarea autoCapitalize="sentences" disabled={attempted} spellCheck placeholder={"..."/* i18n.t('FreeResponse.Placeholder')*/} className="form-control textAreaQuiz textAreaQuizVisor"/>
                        <div className={"exerciseScore"}>{score}</div>
                    </div>
                </div>
            </div>;
        },
        checkAnswer(current, correct) {
            return JSON.stringify(current) === JSON.stringify(correct);
        },
    };
}
/* eslint-enable react/prop-types */