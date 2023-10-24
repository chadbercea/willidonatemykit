# **Will I Donate My Kit? - www.willidonatemykit.com**

## **Objective:**
Provide players of Escape from Tarkov with an interactive tool to estimate the survivability of their upcoming raid based on the value of their kit and the selected map.

## **Tech Stack:**
- **Backend:** Python
- **Frontend:** HTML (rendered) & Bootstrap (dark mode)

## **Features:**

### 1. **Kit Value Estimation:**
   - **Requirement:** Users should be able to input items from their kit (e.g., weapons, armor, medical supplies).
   - **Data Source:** Fetch the current value of items in RUB from the Tarkov API.
   - **Implementation:** 
      - Use Python to query the GraphQL API.
      - Compile the total value of the entered kit items.

### 2. **Map Selection:**
   - **Requirement:** Users should be able to select a map/mission for their upcoming raid.
   - **Data Source:** List of available maps fetched from the Tarkov API.
   - **Implementation:** 
      - Dropdown menu rendered in HTML using Bootstrap classes.
      - Each option corresponds to a map from the API.

### 3. **Survivability Score Calculation:**
   - **Requirement:** Calculate a "Survivability Score" based on the kit's total value and the selected map's difficulty.
   - **Implementation:** 
      - Simple algorithm combining kit value (higher value might imply better gear but also makes the player a more lucrative target) and map difficulty.
      - Display the calculated score prominently on the webpage.

### 4. **User Interface:**
   - **Requirement:** An intuitive interface for users to input their kit and select a map.
   - **Implementation:** 
      - Design a straightforward single-page application.
      - Use Bootstrap (dark mode) for layout, styling, and responsiveness.
      - Provide feedback (e.g., loading indicators) when fetching data.

### 5. **Error Handling:**
   - **Requirement:** Gracefully handle potential issues such as failed data fetches or unexpected inputs.
   - **Implementation:** 
      - Display error messages (e.g., "Tell Chad his robot isn't working. Error Code: XYZ").
      - Ensure the user is informed and can retry or adjust their input as needed.

## **Future Considerations (Post-MVP):**
- User feedback system for refining survivability score accuracy.
- Historical context and random events impacting the survivability score.
- Account creation and user history tracking.


# Tarkov Financial Tools MVP

## Description

This project aims to assist players of the game "Escape from Tarkov" in making informed financial decisions about in-game items. By leveraging a user-friendly web interface, users can search for specific items and view detailed financial data, such as prices from different vendors and the flea market.

## Changelog

### Updates

1. **JavaScript Refactoring**:  
   - Revamped the `searchItem` function to efficiently fetch, process, and display item data from the backend.
   - Refactored the `createCategory` function to dynamically generate detailed item category tabs based on the item data.

2. **CSS Improvements**:  
   - Updated `base.css` to enhance the visual aesthetics of the tool, ensuring a more engaging and seamless user experience.

3. **HTML Layout**:  
   - Made changes to `index.html` to accommodate the refactored JavaScript functions and improved CSS. 
   - Ensured responsive layout for various screen sizes.

4. **Backend Tweaks**:  
   - Made necessary adjustments to `app.py` to ensure smooth data flow and compatibility with the refactored frontend components.

## Testing API Calls

1. Input the name of the Tarkov item you want to search for in the search bar.
2. Click on the 'Search' button.
3. View detailed financial data of the item, such as prices from various sources like different vendors and the flea market.

## Resources

- https://api.tarkov.dev/graphql
- https://github.com/the-hideout/tarkov-api
