import React, {Component} from 'react';
import {Button, ButtonGroup, Col, OverlayTrigger, Popover} from 'react-bootstrap';

import {ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX} from './../../../constants';
import Section from './../section/Section';
import PageMenu from './../page_menu/PageMenu';
import DaliIndexTitle from './../dali_index_title/DaliIndexTitle';
import {isPage, isSection, calculateNewIdOrder} from './../../../utils';
import i18n from 'i18next';

require('./_carrouselList.scss');

export default class CarrouselList extends Component {
    render() {
        return (
            /* jshint ignore:start */
            <div style={{height: 'calc(100% - 25px)'}}>
                <div ref="sortableList"
                     className="carList connectedSortables"
                     style={{paddingTop: 5}}
                     onClick={e => {
                        this.props.onNavItemSelected(0);
                        e.stopPropagation();
                     }}>
                    {this.props.navItems[0].children.map((id, index) => {
                        if (isSection(id)) {
                            return <Section id={id}
                                            key={index}
                                            navItemsIds={this.props.navItemsIds}
                                            navItems={this.props.navItems}
                                            navItemSelected={this.props.navItemSelected}
                                            onTitleChange={this.props.onTitleChange}
                                            onNavItemAdded={this.props.onNavItemAdded}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            onNavItemExpanded={this.props.onNavItemExpanded}
                                            onNavItemReordered={this.props.onNavItemReordered}
                                            onNavItemToggled={this.props.onNavItemToggled}/>
                        } else if (isPage(id)) {
                            let classSelected = (this.props.navItemSelected === id) ? 'selected' : 'notSelected';
                            return <h4 key={index}
                                       id={id}
                                       className={'navItemBlock ' + classSelected}
                                       onMouseDown={e => {
                                            this.props.onNavItemSelected(id);
                                            e.stopPropagation();
                                       }}
                                       onClick={e => {
                                            this.props.onNavItemSelected(id);
                                            e.stopPropagation();
                                       }}>
                                    <span style={{marginLeft: 20 * (this.props.navItems[id].level-1)}}>
                                        <i className="material-icons fileIcon">
                                            {this.props.navItems[id].type == 'slide' ? "slideshow" : "insert_drive_file"}
                                        </i>
                                    <DaliIndexTitle
                                        id={id}
                                        title={this.props.navItems[id].name}
                                        index={this.props.navItems[this.props.navItems[id].parent].children.indexOf(id) + 1 + '.'}
                                        hidden={this.props.navItems[id].hidden}
                                        onTitleChange={this.props.onTitleChange}
                                        onNavItemToggled={this.props.onNavItemToggled}/></span>
                            </h4>
                        }
                    })}
                </div>
                <div className="bottomLine"></div>
                <div className="bottomGroup">
                    <div>
                        <Button className="carrouselButton"
                                disabled={this.props.navItems[this.props.navItemSelected].type !== "section" && this.props.navItemSelected !== 0}
                                onClick={e => {
                                let idnuevo = ID_PREFIX_SECTION + Date.now();
                                this.props.onNavItemAdded(
                                    idnuevo,
                                    i18n.t("section"),
                                    this.props.navItemSelected,
                                    [],
                                    this.props.navItems[this.props.navItemSelected].level + 1,
                                    'section',
                                    this.calculateNewPosition(),
                                    'expanded'
                                );
                                this.props.onBoxAdded({
                                    parent: idnuevo,
                                    container: 0,
                                    id: ID_PREFIX_SORTABLE_BOX + Date.now()},
                                    false,
                                    false
                                );
                                e.stopPropagation();
                            }}>
                            <i className="material-icons">create_new_folder</i>
                        </Button>

                        <PageMenu caller={0}
                                  navItems={this.props.navItems}
                                  navItemSelected={this.props.navItemSelected}
                                  navItemsIds={this.props.navItemsIds}
                                  onBoxAdded={this.props.onBoxAdded}
                                  onNavItemAdded={this.props.onNavItemAdded}/>

                        <OverlayTrigger trigger={["focus"]} placement="top" overlay={
                        <Popover id="popov" title={i18n.t("delete_page")}>
                            <i style={{color: 'yellow', fontSize: '13px'}} className="material-icons">warning</i> {i18n.t("messages.delete_page")}<br/>
                                <Button className="popoverButton"
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}
                                    onClick={(e) => this.props.onNavItemRemoved()}>
                                    {i18n.t("Accept")}
                                </Button>
                                <Button className="popoverButton"
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}  >
                                    {i18n.t("Cancel")}
                                </Button>
                         </Popover>}>
                            <Button className="carrouselButton"
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}>
                                <i className="material-icons">delete</i>
                            </Button>
                        </OverlayTrigger>
                    </div>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }

    calculateNewPosition() {
        if (this.props.navItems[this.props.navItemSelected].type === "section") {
            for (var i = this.props.navItemsIds.indexOf(this.props.navItemSelected) + 1; i < this.props.navItemsIds.length; i++) {
                if (this.props.navItems[this.props.navItemsIds[i]].level <= this.props.navItems[this.props.navItemSelected].level) {
                    return i + 1;
                }
            }
        }

        return this.props.navItemsIds.length + 1;
    }

    sections() {
        var current = 1;
        for (let i in this.props.navItemsIds) {
            if (isSection(this.props.navItemsIds[i])) {
                current++;
            }
        }
        return current;
    }

    componentDidMount() {
        let list = jQuery(this.refs.sortableList);
        let props = this.props;
        list.sortable({
            connectWith: '.connectedSortables',
            containment: '.carList',
            scroll: true,
            over: (event, ui) => {
                $(event.target).css("border-left", "3px solid #F47920");
            },
            out: (event, ui) => {
                $(event.target).css("border-left", "none");
            },
            start: (event, ui) => {
                $("#" + this.props.navItemSelected).css("opacity", "0.5");
            },
            stop: (event, ui) => {
                // This is called when:
                // - An item is dragged from this items's children to another item
                // - A direct child changes it position at the same level
                let newChildren = list.sortable('toArray', {attribute: 'id'});

                // If item moved is still in this element's children (wasn't moved away) -> update
                if (newChildren.indexOf(this.props.navItemSelected) !== -1) {

                    // This is necessary in order to avoid that JQuery touches the DOM
                    // It has to be BEFORE action is dispatched and React tries to repaint
                    list.sortable('cancel');

                    this.props.onNavItemReordered(
                        this.props.navItemSelected, // item moved
                        this.props.id, // new parent
                        this.props.navItems[this.props.navItemSelected].parent, // old parent
                        calculateNewIdOrder(this.props.navItemsIds, newChildren, 0, this.props.navItemSelected, this.props.navItems),
                        newChildren
                    );
                }

                // Restore opacity of moving item
                $("#" + this.props.navItemSelected).css("opacity", "1");
            },
            receive: (event, ui) => {
                // This is called when an item is dragged from another item's children to this element's children
                let newChildren = list.sortable('toArray', {attribute: 'id'});

                // This is necessary in order to avoid that JQuery touches the DOM
                // It has to be BEFORE action is dispatched and React tries to repaint
                $(ui.sender).sortable('cancel');

                this.props.onNavItemReordered(
                    this.props.navItemSelected, // item moved
                    this.props.id, // new parent
                    this.props.navItems[this.props.navItemSelected].parent, // old parent
                    calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.navItemSelected, this.props.navItems),
                    newChildren
                );

                // Restore opacity of moving item
                $("#" + this.props.navItemSelected).css("opacity", "1");
            }
        });
    }
}