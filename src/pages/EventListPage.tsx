import {Link, useNavigate} from "react-router-dom"
import Select from "react-select"
import {components} from "react-select"
import type {DropdownIndicatorProps} from "react-select"
import {useState, useEffect} from "react"
import monthConverter from "../functions/DateConverter"
import type Event from "../util/dtos/Event"

import "../css/SearchPage.css"

type Props = {
    title: string;
    fetchEvents: () => Promise<Event[]>;
};

export default function EventListPage({title, fetchEvents}: Props) {

    const [results, setResults] = useState<Event[]>([]);
    const [notFound, setNotFound] = useState(false);
    const [filter, setFilter] = useState("all");
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents().then(events => {
            if (events.length === 0) {
                setNotFound(true);
                setResults([]);
            } else {
                setResults(events);
                setNotFound(false);
            }
        });
    }, [fetchEvents]);

    const sortedEvents = (results: Event[]) => {
        switch (filter) {
            case "all":
                return results;
            case "upcoming":
                return results.slice().sort((a, b) => new Date(a.eventDateStart).getTime() - new Date(b.eventDateStart).getTime());
            case "alphabetical":
                return results.slice().sort((a, b) => String(a.eventName).localeCompare(String(b.eventName)));
            case "popular":
                return results.slice().sort((a, b) => b.totalClicks - a.totalClicks);
            default:
                return [];
        }
    }

    const DownArrowIcon = () => (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path
                d="M8.20711 10C7.76165 10 7.53857 10.5386 7.85355 10.8536L11.6464 14.6464C11.8417 14.8417 12.1583 14.8417 12.3536 14.6464L16.1464 10.8536C16.4614 10.5386 16.2383 10 15.7929 10H8.20711Z"
                fill="#333"
            />
        </svg>
    )

    const UpArrowIcon = () => (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path
                d="M8.20711 14C7.76165 14 7.53857 13.4614 7.85355 13.1464L11.6464 9.35355C11.8417 9.15829 12.1583 9.15829 12.3536 9.35355L16.1464 13.1464C16.4614 13.4614 16.2383 14 15.7929 14H8.20711Z"
                fill="#333"
            />
        </svg>
    )

    const SortIcon = () => (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path
                d="M10.5 13V11H18.5V13H10.5ZM10.5 19V17H14.5V19H10.5ZM10.5 7V5H22.5V7H10.5ZM6.5 17H9L5.5 20.5L2 17H4.5V4H6.5V17Z"
                fill="#333"
            />
        </svg>
    )

    const DropdownIndicator = (props: DropdownIndicatorProps<any, boolean, any>) => (
        <components.DropdownIndicator {...props}>
            {props.selectProps.menuIsOpen ? <UpArrowIcon/> : <DownArrowIcon/>}
        </components.DropdownIndicator>
    );

    const filterLabels: { [key: string]: string } = {
        all: "All",
        upcoming: "Upcoming",
        alphabetical: "Alphabetical",
        popular: "Most Popular"
    };


    return (
        <>
            <div className="search-page">
                <div className="search-info">
                    <div className="search-context">{title}</div>
                    <div className="sort-button">

                        <div onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className="sort-icon">
                            <SortIcon/>
                        </div>
                        <Select classNamePrefix="sort-select"
                                isSearchable={false}
                                components={{DropdownIndicator}}
                                menuIsOpen={isSortMenuOpen}
                                onMenuOpen={() => setIsSortMenuOpen(true)}
                                onMenuClose={() => setIsSortMenuOpen(false)}
                                value={{value: filter, label: filterLabels[filter] || "All"}}
                                onChange={option => {
                                    if (option && !Array.isArray(option) && "value" in option) {
                                        setFilter(option.value);
                                    } else {
                                        setFilter("all");
                                    }
                                }
                                }
                                styles={{
                                    menu: (provided) => ({
                                        ...provided,
                                        width: 150,
                                        background: "#f8f8f8",
                                    }),
                                }}
                                options={[
                                    {value: "all", label: "All"},
                                    {value: "upcoming", label: "Upcoming"},
                                    {value: "alphabetical", label: "Alphabetical"},
                                    {value: "popular", label: "Most Popular"}
                                ]}></Select>
                    </div>
                </div>
                {notFound ?
                    <div className="no-search-found">Woops! Seems no events could be found here. Maybe try something
                        else?<br/><br/>
                        Suggestions:
                        <ul>
                            <li>Search for an event.</li>
                            <li>Search for a host</li>
                            <li>Search for a category</li>
                            <li>Navigate through category menus</li>
                        </ul>
                        <div className="no-search-found-image">
                            <img src="/src/assets/Chillin.png" alt="Image of a dude chilling on a sunbed"></img></div>
                    </div> :
                    <div className="searched-events">
                        {sortedEvents(results).map((event: Event) => {
                            const dateStart: Date = new Date(event.eventDateStart);
                            return (
                                <div className="event" key={event.eventId}>

                                    <div className="searched-event-item">
                                        <div className="date">
                                            <div className="day">
                                                {dateStart.getDate() + ""}
                                            </div>
                                            <div className="month">
                                                {monthConverter(dateStart.getMonth())}
                                            </div>
                                        </div>
                                        <div className="info">
                                            <div className="event-name">
                                                {event.eventName}
                                            </div>
                                            <div className="event-arena">
                                                {event.eventVenue.arena}
                                            </div>

                                            <div className="searched-event-button">
                                                <button onClick={() => navigate("/event/" + event.eventId)}>
                                                    Go to event
                                                </button>

                                            </div>

                                        </div>
                                    </div>


                                </div>
                            )
                        })
                        }
                    </div>
                }
            </div>
        </>
    );
}

