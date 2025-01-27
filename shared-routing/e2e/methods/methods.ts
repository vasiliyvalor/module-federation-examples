import {baseSelectors, fields, selectors, updatedSelectors} from "../../../cypress/common/selectors";
import {Constants} from "../../../cypress/fixtures/constants";
import {BaseMethods} from "../../../cypress/common/base";

export class SharedRoutingMethods extends BaseMethods {

    public checkInputWithLabelVisibilityInsideBlock(formField: string, text: string):void {
        cy.get(baseSelectors.input).parentsUntil(formField).find(baseSelectors.label)
            .should( 'contain.text', text)
    }

    public returnReplacedFormFieldSelector({
         index,
         replaceElement
    }: {
        index? : number,
        replaceElement? : string
    }): string {
        // @ts-ignore
        if(index >= 0) {
            // @ts-ignore

            const replaceSelectorPart = index === 7 ? Constants.elementsText.sharedRoutingAppSelectorsParts.userInfo.toUpperCase() : Constants.elementsText.sharedRoutingAppEditProfileBlockLabels[index].replace(/\s/g, '_')
                    .replace(/([()])/g, '')

            return fields.commonField.replace('{fieldName}', replaceSelectorPart.toUpperCase())
        }

        // @ts-ignore
        return fields.commonField.replace('{fieldName}', replaceElement)
    }

    public checkHamburgerMenuFunctionality(): void {
        Constants.elementsText.sharedRoutingAppSideMenuButtonsTypes.forEach(buttonType => {
            this.checkElementWithTextPresence({
                selector: selectors.hrefSelector.replace('{link}', `/${buttonType.toLowerCase()}`),
                text: buttonType,
                visibilityState: 'not.be.visible'
            })
            this.clickElementBySelector({selector: updatedSelectors.hamburgerMenuButton})
            this.checkElementWithTextPresence({
                selector: selectors.hrefSelector.replace('{link}', `/${buttonType.toLowerCase()}`),
                text: buttonType,
                visibilityState: 'be.visible'
            })
            this.checkElementVisibility(updatedSelectors.hamburgerMenuButton, false)
            this.clickElementBySelector({selector: selectors.sharedRoutingAppCloseSideMenuButton})
            this.checkElementWithTextPresence({
                selector: selectors.hrefSelector.replace('{link}', `/${buttonType.toLowerCase()}`),
                text: buttonType,
                visibilityState: 'not.be.visible'
            })
        })
    }

    public visitOnPageByName(checkedPageHeader: string, remotePageHeader: string, host: number): void {
        this.openLocalhost(host, remotePageHeader)
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: remotePageHeader,
            visibilityState: 'be.visible'
        })
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: checkedPageHeader,
            isVisible: false
        })
        this.clickElementBySelector({selector: selectors.hrefSelector.replace('{link}',
                `/${checkedPageHeader.toLowerCase()}`)})
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: remotePageHeader,
            isVisible: false
        })
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: checkedPageHeader,
            visibilityState: 'be.visible'
        })
    }

    public transferringThroughPages(landingPageHeader: string, firstRemotePageHeader: string, secondRemotePageHeader: string): void {
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: landingPageHeader,
            visibilityState: 'be.visible'
        })
        this.clickElementBySelector({selector: selectors.hrefSelector.replace('{link}',
                `/${firstRemotePageHeader.toLowerCase()}`)})
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: firstRemotePageHeader,
            visibilityState: 'be.visible'
        })
        this.clickElementBySelector({selector: selectors.hrefSelector.replace('{link}',
                `/${secondRemotePageHeader.toLowerCase()}`)})
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: secondRemotePageHeader,
            visibilityState: 'be.visible'
        })
        cy.reload()
        this.checkElementWithTextPresence({
            selector: baseSelectors.header,
            text: secondRemotePageHeader,
            visibilityState: 'be.visible'
        })
    }

    public checkElementWithTextPresenceForMultipleTexts
    ({
         textsArray,
         parentSelector,
         selector,
         childElement,
         visibilityState = 'be.visible'
    }: {
        textsArray: string[],
        parentSelector: string,
        selector: string,
        childElement?: boolean
        visibilityState?: string
    }): void {
        textsArray.forEach(text => {
            if(childElement) {
                this.checkChildElementVisibility(parentSelector, selector.replace(
                        '{cellType}', text.replace(/\s/g, '_').toUpperCase()))
            } else {
                this.checkElementWithTextPresence({
                    parentSelector,
                    selector: selector.replace(
                        '{cellType}', text.replace(/\s/g, '_').toUpperCase()),
                    text,
                    visibilityState
                })
            }
        })
    }

    public checkElementWithTextPresenceByForCycle
    ({
         textsArray,
        parentSelector,
        selector,
        text
    }: {
        textsArray: string[],
        parentSelector: string,
        selector: string,
        text: string[]
    }): void {
        for (let i = 0; i <  textsArray.length; i++) {
            this.checkElementWithTextPresence({
                parentSelector,
                selector: selector.replace(
                    '{cellType}', textsArray[i]
                        .replace(/\s/g, '_').toUpperCase()),
                text: text[i],
                visibilityState: 'be.visible'
            })
        }
    }

    public checkInputValueByForCycle
    ({
         value,
         multipleSizeStringsArray,
         isReloaded = false
    }: {
        value?: any,
        multipleSizeStringsArray? : string[]
        isReloaded? : boolean
    }): void {
        for (let i = 1; i < 8; i++) {
            const formFieldSelector = this.returnReplacedFormFieldSelector({index: i})

            if(multipleSizeStringsArray) {
                multipleSizeStringsArray.forEach(string => {
                    this._fillFieldAndCheckValue(formFieldSelector, string, isReloaded)
                })

                return;
            }

         this._fillFieldAndCheckValue(formFieldSelector, value, isReloaded)
        }
    }

    private _fillFieldAndCheckValue(formFieldSelector: string, value: string, isReloaded : boolean = false):void {
        this.fillField({
            parentSelector: formFieldSelector,
            selector: this.getInputSelector(formFieldSelector),
            text: value
        })
        this.checkInputValue(value, formFieldSelector)

        if(isReloaded) {
            cy.reload()
            this.checkInputValue('', formFieldSelector)
        }
    }

}