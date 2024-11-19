import React from 'react';

type Tag = {
  id: number;
  name: string;
};

type TagSectionProps = {
  tags: Tag[];
};

const TagSection: React.FC<TagSectionProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return <p className="text-gray-500">No tags available</p>;
  }

  return (
    <div id="book-tags" className="mt-8 h-60">
      {tags.map((tag) => (
        <span key={tag.id} className="bg-[#302939] m-1 rounded-md p-2 text-white">
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagSection;
