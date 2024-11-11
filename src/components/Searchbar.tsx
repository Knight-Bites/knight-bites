import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import { IoSearch } from "react-icons/io5";

interface SearchbarProps {
  onSearchSubmit: (searchQuery: string) => void;
}

function Searchbar({ onSearchSubmit }: SearchbarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (searchQuery == null || searchQuery == "") {
      return;
    }
    onSearchSubmit(searchQuery);
    setSearchQuery("");
  }

  return (
    <Form className="col-md-4 m-3" onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Group as={Col}>
          <Form.Control
            id="searchbar"
            placeholder="Search KnightBites"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </Form.Group>
        <Button
          type="submit"
          variant="outline-dark"
          className=" d-flex align-items-center"
        >
          <IoSearch size={20} />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default Searchbar;
