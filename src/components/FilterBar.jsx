import { LibraryBig, Diamond, RectangleVertical } from "lucide-react";

export function FilterBar({ view, onViewChange }) {
  function filterBtnTemplate(type, Icon) {
    return (
      <button
        className={`cursor-pointer flex flex-row gap-1 items-center border-b-3 ${
          view === type ? " border-[#40C4FF]" : "border-transparent"
        }`}
        onClick={() => onViewChange(type)}
      >
        <Icon size={16} />
        {type}
      </button>
    );
  }

  return (
    <div className="flex flex-row gap-5 text-base font-normal">
      {filterBtnTemplate("Poster", RectangleVertical)}
      {filterBtnTemplate("Detailed", LibraryBig)}
    </div>
  );
}
