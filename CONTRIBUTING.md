# Contributing to Awesome ISPs ZA

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## How to Contribute

### Adding or Updating ISP Data

1. Fork the repository
2. Create a new branch: `git checkout -b feature/add-atomic-access`
3. Edit `isps.json` in the `data` directory
4. Commit your changes: `git commit -m 'Add Atomic Access'`
5. Push to your fork: `git push origin feature/add-atomic-access`
6. Submit a Pull Request

### Data Format

When adding an ISP, ensure all required fields are completed. Example format:

```
{
  "name": "String",
  "provinces": ["Array of Strings"],
  "fnos": ["Array of Strings"],
  "googleRating": "Number or null",
  "helloPeterRating": "Number or null",
  "cgnat": "Boolean",
  "ipv6": "Boolean",
  "founderRun": "Boolean",
  "connectionType": "String (DHCP/PPPoE)",
  "supportBots": "Boolean",
  "fibreOnly": "Boolean",
  "yearsInBusiness": "Number",
  "size": "String (Small/Medium/Large)",
  "communityForum": "Boolean",
  "ecsOnly": "Boolean"
}
```

### Data Validation

- All ratings must be between 0 and 5
- Province names must match official SA province names
- Years in business must be a positive integer
- Boolean values must be true/false (not strings)

### Code Style

- Use 2 spaces for indentation
- Sort JSON entries alphabetically by ISP name
- Maintain consistent formatting

## Local Development

1. Clone your fork:
   git clone https://github.com/byronrode/awesome-isps.git

2. Install dependencies:
   npm install

3. Run locally:
   npm start

## Pull Request Process

1. Ensure your PR description clearly describes the changes
2. Include sources for any new data
3. Update documentation if needed
4. Wait for review and address any feedback

## Data Sources and Verification

When adding or updating ISP information, please:

1. Use official sources when possible (ISP websites, ICASA data)
2. Include links to sources in PR description
3. Verify technical claims (IPv6, CGNAT status)
4. Update ratings only with current data

## Reporting Issues

When reporting issues, please:

1. Use the issue template
2. Include steps to reproduce (if applicable)
3. Provide context and screenshots
4. Label appropriately

## Review Process

All submissions will be reviewed for:

1. Data accuracy
2. Formatting consistency
3. Documentation completeness
4. Code quality (if applicable)

## Community Guidelines

- Be respectful and constructive
- Follow the code of conduct
- Help others contribute
- Acknowledge others' contributions

## Questions?

- Open an issue for general questions
- Contact maintainers for sensitive issues
- Join our community discussions

## Recognition

Contributors will be:

- Listed in our README
- Credited in release notes
- Thanked in our documentation

Thank you for helping make Awesome ISPs ZA better!
